#!/usr/bin/env python3
"""
Skill Web Bundle Generator

Packages a skill directory into a web-compatible text bundle.
"""

import argparse
import re
import sys
from pathlib import Path


def validate_skill_structure(skill_path):
    """Validate that the skill follows standard structure."""
    skill_path = Path(skill_path)
    
    if not skill_path.exists():
        return False, f"Skill directory not found: {skill_path}"
    
    if not skill_path.is_dir():
        return False, f"Path is not a directory: {skill_path}"
    
    # Check for required SKILL.md
    skill_md = skill_path / "SKILL.md"
    if not skill_md.exists():
        return False, "Required SKILL.md file not found"
    
    # Validate SKILL.md metadata
    try:
        content = skill_md.read_text(encoding='utf-8')
        if not re.search(r'^---\s*\n.*?name:\s*\S+.*?\n.*?description:\s*\S+.*?\n.*?---\s*$', content, re.MULTILINE | re.DOTALL):
            return False, "SKILL.md missing required metadata (name, description)"
    except Exception as e:
        return False, f"Error reading SKILL.md: {e}"
    
    return True, "Skill structure is valid"


def check_scripts_directory(skill_path):
    """Check if scripts directory exists and has files."""
    scripts_dir = Path(skill_path) / "scripts"
    if not scripts_dir.exists():
        return False, []
    
    script_files = [f for f in scripts_dir.rglob('*') if f.is_file()]
    return len(script_files) > 0, script_files


def bundle_skill_files(skill_path, skill_name):
    """Bundle all skill files into a single text content."""
    skill_path = Path(skill_path)
    bundle_content = []
    
    # Standard directories to process in order
    directories = ['', 'scripts', 'references', 'templates', 'assets']
    
    for dir_name in directories:
        if dir_name == '':
            # Root directory - only process SKILL.md
            skill_md = skill_path / "SKILL.md"
            if skill_md.exists():
                content = skill_md.read_text(encoding='utf-8')
                bundle_content.append(f"==================== START: skills/{skill_name}/SKILL.md ====================")
                bundle_content.append(content)
                bundle_content.append(f"==================== END: skills/{skill_name}/SKILL.md ====================")
                bundle_content.append("")
        else:
            # Process subdirectories
            dir_path = skill_path / dir_name
            if dir_path.exists() and dir_path.is_dir():
                for file_path in sorted(dir_path.rglob('*')):
                    if file_path.is_file():
                        relative_path = file_path.relative_to(skill_path)
                        try:
                            # Try to read as text
                            content = file_path.read_text(encoding='utf-8')
                            bundle_content.append(f"==================== START: skills/{skill_name}/{relative_path} ====================")
                            bundle_content.append(content)
                            bundle_content.append(f"==================== END: skills/{skill_name}/{relative_path} ====================")
                            bundle_content.append("")
                        except UnicodeDecodeError:
                            # Binary file - include placeholder
                            bundle_content.append(f"==================== START: skills/{skill_name}/{relative_path} ====================")
                            bundle_content.append(f"[Binary file: {file_path.name}]")
                            bundle_content.append(f"==================== END: skills/{skill_name}/{relative_path} ====================")
                            bundle_content.append("")
    
    return '\n'.join(bundle_content)


def generate_web_bundle(skill_path, skill_name, output_dir):
    """Generate the complete web bundle."""
    # Read template
    template_path = Path(__file__).parent.parent / "templates" / "web_bundle_template.txt"
    if template_path.exists():
        template = template_path.read_text(encoding='utf-8')
    else:
        # Fallback template if template file doesn't exist
        template = """# Web Agent-Skill Bundle Instructions

You are now operating as a specialized AI agent-skill. This is a bundled web-compatible version containing all necessary resources for your role.

## Important Instructions

1. **Follow all skill task or workflow**: Your skill includes startup instructions that define your task, workflow and references. These MUST be followed exactly.

2. **Resource Navigation**: This bundle contains all resources you need. Resources are marked with tags like:

- `==================== START: skills/{skill_name}/folder/filename.md ====================`
- `==================== END: skills/{skill_name}/folder/filename.md ====================`

When you need to reference a resource mentioned in your instructions:

- Look for the corresponding START/END tags
- The format is always the full path (e.g., `skills/{skill_name}/references/file1.md`, `skills/{skill_name}/templates/templates1.md`)
- If a section is specified (e.g., `{{root}}/references/file1.md#section-name`), navigate to that section within the file

These references map directly to bundle sections:

- `references: filename-1` → Look for `==================== START: skills/{skill_name}/references/filename-1.md ====================`
- `templates: templates1` → Look for `==================== START: skills/{skill_name}/templates/templates1.md ====================`

3. **Execution Context**: You are operating in a web environment. All your capabilities and knowledge are contained within this bundle. Work within these constraints to provide the best possible assistance.

4. **Primary Directive**: Your primary goal is defined in your agent-skills configuration below. Focus on fulfilling your designated task/workflow.

---

{bundled_content}
"""
    
    # Bundle skill files
    bundled_content = bundle_skill_files(skill_path, skill_name)
    
    # Generate final bundle
    web_bundle = template.format(
        skill_name=skill_name,
        bundled_content=bundled_content
    )
    
    # Save to output
    output_path = Path(output_dir) / f"{skill_name}.txt"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(web_bundle, encoding='utf-8')
    
    return output_path


def main():
    parser = argparse.ArgumentParser(description='Bundle a skill for web use')
    parser.add_argument('--skill-path', required=True, help='Path to skill directory')
    parser.add_argument('--output', required=True, help='Output directory for bundle')

    args = parser.parse_args()

    skill_path = Path(args.skill_path)
    skill_name = skill_path.name

    # Check for self-bundling
    if skill_name == 'skill-web-bundle':
        print("❌ 错误：不能打包skill-web-bundle自己")
        sys.exit(1)

    # Validate skill structure
    valid, message = validate_skill_structure(skill_path)
    if not valid:
        print(f"❌ 验证失败: {message}")
        sys.exit(1)
    
    print(f"✅ {message}")
    
    # Check for scripts
    has_scripts, script_files = check_scripts_directory(skill_path)
    if has_scripts:
        print(f"\n⚠️  警告：检测到scripts脚本文件")
        for script in script_files:
            print(f"   - {script.relative_to(skill_path)}")
        print("在web环境中可能无法正常执行skill功能。")
    
    # Generate bundle
    print(f"\n📦 开始打包 {skill_name}...")
    try:
        output_path = generate_web_bundle(skill_path, skill_name, args.output)
        print(f"✅ Web bundle打包成功！")
        print(f"📦 产物路径: {output_path}")
        print(f"💡 该文件可直接复制到任何web端AI聊天机器人中使用")
    except Exception as e:
        print(f"❌ 打包失败: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()


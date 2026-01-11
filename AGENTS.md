

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:
- Invoke: Bash("openskills read <skill-name>")
- The skill content will load with detailed instructions on how to complete the task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
</usage>

<available_skills>
<skill>
<name>skill-creator</name>
<description>Use this skill when users need to create a new skill. Triggers when user mentions "create skill" or "new skill".</description>
<commands>/skill-creator </commands>
<location>project</location>
</skill>

<skill>
<name>skill-list</name>
<description>List all available skills from AGENTS.md. Triggers when user mentions "列出技能", "list skills", "可用技能", "show skills", "技能列表".</description>
<commands>/skill-list</commands>
<location>project</location>
</skill>

<skill>
<name>skill-web-bundle</name>
<description>Package skills into web-compatible bundles. Converts any skill directory into a single .txt file containing all resources, making it usable in web-based AI chatbots. Validates skill structure and warns about script compatibility. Triggers when user mentions "skill-web-bundle", "打包skill", "web bundle", or wants to create web bundles of skills for external use.</description>
<commands>/skill-web-bundle</commands>
<location>project</location>
</skill>

<skill>
<name>sudoku-coach</name>
<description>A professional Sudoku coach that generates valid puzzles (3-6 grid sizes) with adjustable difficulty (1-5 stars) and provides printable card prompts.</description>
<commands>/sudoku-coach </commands>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>

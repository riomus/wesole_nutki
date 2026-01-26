

I'll continue implementing the CMS Program Management for Multi-language Content feature. Let me first explore the codebase to understand the current structure and identify what needs to be implemented.


Now let me create a todo list to track the implementation tasks and start diagnosing the CMS visibility issues:


Let me start by checking the existing program files to see if they have the required `type: "program"` field:



Now let me check the frontmatter of these program files to see if they have the required `type: "program"` field:


Great! I can see that the program files already have the required `type: "program"` field. Let me check the other program files as well:


Perfect! All program files have the required `type: "program"` field. Now let me check the CMS configuration to see how the collections are set up:



Let me search for the program collections in the CMS config:



Let me read the specific sections of the CMS config for the program collections:



Excellent! The CMS configuration looks correct. Both collections have:
1. Proper filter: `{field: "type", value: "program"}`
2. Hidden type field with default "program"
3. Correct folder paths
4. Create: true enabled

Now let me update the todo and start the Hugo server to test the admin interface:
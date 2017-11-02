# Mr. V's Manifesto

In preparation for dramatically-powerful-computer-technology-in-the-near-future, my short-term goal is to teach software development. My long-term goal is to write software to help mankind organize itself better. More specifically, I want to teach young adults how to participate in large projects, to develop tools that solve problems enabling dysfunctional governance, and to create AI that identifies ways to improve logistical efficiency in human tasks while accounting for human goals. I have a succession of specific software products in mind for this.

### Why "Teach Software Development" in the Short Term?

[The "Technological Singularity" / achievement-of-super-intelligence-through-computer-technology is coming.](http://www.codegiraffe.com/singularity.png) There are many resources online that explain this, [Wikipedia](https://en.wikipedia.org/wiki/Technological_singularity) is an excellent starting-point for the un-initiated.

Regardless of your opinion on the technological-singularity, the fact that powerful-computing-technology is coming is very clear. Powerful-tools are dangerous if used unwisely. More eyes watching powerful-tools does-a-lot to keep those tools from being used unwisely. So, more computer-experts will do-a-lot to keep powerful computer technology from being used unwisely.

### A student of software development learns ...
* **attention to detail** - that instructions and information can be misunderstood, and being exact results in consistent performance.
* **grit** - to accept error and imperfection as a natural part of learning, and to forgive-oneself quickly, so that progress can be made.
* **rapid-prototyping** - that writing and testing software is cheap, even when it fails. Having results from lots of quickly-done-and-*incorrect* solutions is a great guide toward a *correct*-solution.
* **anything can be understood** - that even incomprehensible systems can be understood one small piece at a time.
* **patience with unintuitive ideas** - that software works in ways that are not always easy to understand, but are still true, and eventually understandable.
* **the habit of problem solving** - that solving-a-problem is satisfying and encouraging, and anyone is capable of solving a problem.
* **new limits for personal mental ability** - solving software problems requires development of mental tools not required by many other fields of study.
* **to think-about-thinking (metacognition)** - that creating-an-algorithm requires introspection: awareness of your own thought process, enough that you can name and list your own thoughts.
* **faith in science** - that forming a hypothesis and testing it to validate understanding is a profoundly effective tool for developing human knowledge.
* **metacognitive awareness** - that ability to think is determined by mental state, and *managing mental state* (with food, sleep, addressing emotional issues, ...) is a foundation for successful problem solving.
* **confidence as a computer user** - that practice with computers alone makes someone better with computers.
* **fearlessness of computers** - that a computer is just a tool, with no emotions, no motives, no purpose beyond what it was designed to do, and the ability to multiply its programmer's intelligence and influence.
* **fail-fast** - the pholosophy of engineering: it is good to fail an entire-process the moment some small part is incorrect, so it *will* be fixed, and the process can be perfect sooner.
* **understanding is power** - that understanding-a-problem all by itself is almost enough to solve it.

I'm teaching kids technology. It's existentially-satisfying, and I can't stop.

### Prophecy of the Future

As computer-technology improves, many (possibly most) people won't be able to find productive work. Computer-controlled tools will be able to do almost every task a human does, but most-likely better, and almost certainly far more cheaply. Humans will have computer assisted jobs, taking advantage of hardware-and-software to multiply effectiveness, using communication and embeded logic to integrate logistics, reduce waste, educate on-the-fly, track quality/progess of workers, and more. The humans who are working have work output similar to hundreds or thousands of humans working without computers.

Computer tools will even be used for tasks that computers can't do well, like things that human-bodies are almost uniquely good at, things that involve human touch, direct human-to-human interaction, handling human emotions, witnessing the human condition, etc. Humans who know how to use computers to multiply their own effort doing these tasks will be employable.

### So what about everyone who is not a computer wizard?

**"Impetus AR"** - a real-time re-education tool that will turn a population of disenfranchised meat-bags into a productive, organized work force. Imagine an Augmented Reality (AR) system that points a person toward productive actions that benefit the causes they are aligned with. The system identifies tasks, directs users to tools and resources, educates users on proper use of tools and resources, and logs the completion of their tasks. Step-by-step-instruction, along with tool and resource information will be fed to the AR system by "Impetus Jobs".

**"Impetus Jobs"** - Imagine a combination of LinkedIn and TaskRabbit, with a Strong-AI data prediction/analysis tool balancing work-load for maximum probability of success. Impetus Jobs will have have information about a person as a worker, including their skills, preferred kinds of work, and life-goals. Workers will be matched with tasks nearby, with worker advancement in-mind. Tutorial tasks will be created by the system to improve skills, and work toward accomplishment of ideals and life-goals of the workers. Very large tasks, composed of many subtasks, will be populated by a project-management-software suite, "Impetus Project".

**"Impetus Project"** - Project-management software that handles arbitrary tasks of arbitrary complexity, resource usage, and personnel. It works with tasks in many different dimensions, including work-breakdown-structure, GANTT chart, burndown chart, and resource & personnel spread-sheets. Impetus Project also does predictive-analysis of projects using algorithms that improve estimation with data from past performance (no strong AI, that is what Impetus Jobs is for). The data model and user interface for Impetus Project is based on the game "Galactus".

**"Galactus"** - A real-time strategy game about seeking out partner-agents, with diverse skill sets, to accomplish complex goals. Goal-objects are worked by an agent skills. An agent working a skill improves the agent's skill, and allows greater goals to be completed. Some goals have a dependency-graph that forces sub-goals to be accomplished first (think GANTT chart), in sometimes complex sequences. Agents recruit partner-agents with complementary skills to accomplish complex goals.

**"My Dragon"**: The plan I'm following in pursuit of the software outlined above

Galactus comes first. It has to be a game (and project-management-software second), otherwise it will not be adopted as easily by disenfranchised gamer millenials, who are a risk to society if they cannot find a way to learn to integrate into works larger than themselves. Sadly, game development is not an economically wise business plan. But...

Once there is a game that is usable as enterprise software, selling a version of that game as enterprise software should not be impossible. The sales proposition could be as simple as "Many of your young employees already know this user interface well. The interface is a game that teaches mastery of itself." Learning-curve and user-interface tend to be big complaints about enterprise software, which by the way, *is* a lucrative industry.

Impetus Jobs is a natural evolution of Impetus Project: integrate social-media and job-boards, apply machine learning.

Impetus AR will need cheap AR hardware, mature machine-vision software technology, and significant amounts of dynamic tutorial content for which there are currently (as of Oct 2017) no models.

### Current foci for Galactus (essentially a public TODO list):
* 3D math code (command zones, AI, 3D voronoi, navmesh pathfinding)
  * in development in Unity3D
* spreadsheet UI
  * in development in Unity3D, with functional scripting engine
* Instant Runoff Voting tools (multiplayer decision making, AI)
  * need to convert .js code to C#, develop visuals, probably share that as a stand-alone data visualization app
* dynamic stat system
  * using common scripting system also used by spreadsheet UI, may not scale well to thousands of objects. generate C# objects?
* General AI (state-machines, steering behaviors)
  * should find a good API someone else wrote and add 3D math code to it
* movement/control modes (space fly, FPS/3rd-Person, ground-fly)
  * need to stabalize code, add support for animations for fully-customizable models
* artifact building
  * agent can build roads, barriers, caches, monuments
* VR controls
  * more experimentation required, need to integrate into movement/control UI
* scripting system
  * need to make imperative code more java-script like.
* Project & Task system
  * use the scripted JSON-like datastructures as the base
* Personnel & Resource system
  * requires spreadsheet UI, scripts, and stat/trait system for personnel to inform AI simulation
* Project Management Visualizations (WBS, GANTT, burndown)
  * refresh and import old code
* Customization UI
  * need to find and implement color picker, sprite loader/picker, simple model generator and basic texture mapper

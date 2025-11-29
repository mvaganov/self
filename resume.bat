node spp.js RESUME.md RESUME_redux.md redux
rem running "grip", which can be installed by "pip". use administrator mode cmd, and do "python -m pip install grip"
grip RESUME_redux.md --export
node tagshow.js RESUME_redux.html grip-content
del resume.htm
ren RESUME_redux_modified.html resume.htm
del RESUME_redux.html
rem grip RESUME_redux.md

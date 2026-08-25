# EAW

Main EAW plataform.

# Main components

Inside this folder, there are the main components code to run this plataform:

- `ci`: content the files to manage the ci, there are two folders
- `db`: content the models of the project
- `front-end`: content all clients projects
- `back-end`: content the project to manage all logic of the servers
- ...

All this modules can be build into Docker containers. Each folder has its own README text with their image build requisites, like building dependencies and enviroment variables.

# How to build the entire project?

We use GitLab CI/CD script to test, build and deploy the main modules and setting up the environment variables needed for each stage. The Docker images and containers are managed by the `docker-compose.yml` script inside of each `ci` folder.

So, if you want to build all from a GitLab instance, it will try to automatically build everything with the first push to the `master` branch, for the estable release version. Anyways, you can mount each module individually or build its Docker image and connect all inside the same Docker network (see each `README.md` file inside project modules).

# Environment variables

The list of environment variables are in the gitlab project in settings of ci.

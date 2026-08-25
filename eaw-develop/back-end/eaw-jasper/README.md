# Steps to set up jasper

## Why this?

The original image used in the production server hosted the reports referenced in this project. For reasons beyond this document we lost access to said server and cut relations with the client. The team involved in the development of both projects took the awful decision to host reports in an unrelated service provided and mantained by a customer. 

So, to rebuild the capabilities of the EAW to create reports we are now trying to implement an instance of jasperreports docker while there is no documentation about requirments or config needed to implement this.

## Using image from sicid: 

This image named __jasper_copy__ is an image taken from the project SICID during it's last months of development. This is an server implemented for the sicid and does not have any report of EAW. 

The image was obtained by [@StephanieQuirosAraya](https://gitlab.com/StephanieQuirosAraya) and is yet to be backed up. To run said image we need to:

- copy the tar file to the server
- load the image from the file
- run a container to extract config file
- copy file ***default_master.properties*** to server' home dir
- alter hard coded config data
- copy altered file to ***container-name:bitnami/jasperreports/buildomatic/default_master.properties***
- restart container. 

```
$ sudo docker load -i ./<name-of-tile.tar>
$ sudo docker run -e MARIADB_HOST=13.58.240.19\
 -e JASPERREPORTS_DATABASE_NAME="SICID_jasper" \
 -e JASPERREPORTS_DATABASE_USER="inclutec-db-admin"\
 -e JASPERREPORTS_DATABASE_PASSWORD="inclutecDevAdmin"\
 -e JASPERREPORTS_EMAIL="inclutec.notifications@gmail.com"\ -e "MARIADB_PORT_NUMBER=5206" --network=eaw_net\
 -p 4100:8080 --name eaw-jasper <name-of-image:tag>
$ sudo docker cp <name-of-container>:bitnami/jasperreports/buildomatic/default_master.properties .
$ vim default_master.properties --use prefered text editor.
$ sudo docker cp ./default_master.properties <name-of-container>:bitnami/jasperreports/buildomatic/default_master.properties
$ sudo docker restart <name-of-container>
```

pasos siguientes: crear nueva imagen. Crear docker file. explicar xq mejor dockerfile. 
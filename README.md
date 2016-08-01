## MetLife Alico Online ##

The is a simple and personal tool to convert my MetLife Alico insurance excel sheet (.xlsx file) to a user-friendly online app. This makes it much easier for me to lookup hospitals and pharmacies on the fly.

Though it was developed quickly as personal tool, you are free to fork and edit to meet your requirements in any similar uses.

It is based on PHP5.5 using Slim Framework and React JS.

*Note*: It is a one-day hack so do not expect to see error-proof code or tests.

![alt tag](http://thaghry.com/img/screenshots/alico-demo.png)

Setup
-----
To setup the project on your server:

1- Clone the project

2- Install composer dependencies


    php ./composer.phar install

3- Create a MySQL database.

4- Copy the .env template file and edit the database credentials.


    cp ./.env.php.template ./.env.php
    nano ./.env.php

5- Check Slim Framework docs for web server configs: [Web Servers](http://www.slimframework.com/docs/start/web-servers.html)

6- Now the project is ready to start. It only needs data.

Processing
----------
The processing script was tailored for the excel sheet I had. So you can use the same format or edit the script for your sheet.
Just call:

    php ./lib/process_alico.php
It will take a few minutes to process the file and create database entries.

**Important**:  Do not leave this script on the server after database migration. It is not safe to leave it accessible to users.

Usage
-----
You can view an online demo for [MetLife Alico](http://alico.sarmady.net/) to see how it works. This demo is an older version (neither using ReactJS not SlimPHP) but it has the exact same view and functionality.


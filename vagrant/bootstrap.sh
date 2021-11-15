#variables
DBHOST=localhost
DBNAME=pallas
DBUSER=pallas
DBPASSWD=testpass


# Update packages
sudo apt-get update

# The certificate for deb.nodesource seems to be expired
sudo apt install ca-certificates

# Install Node.js and NPM
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install npm
sudo npm install -g npm@6.14.6

#install mysql
debconf-set-selections <<< "mysql-server mysql-server/root_password password $DBPASSWD"
debconf-set-selections <<< "mysql-server mysql-server/root_password_again password $DBPASSWD"
apt-get install -y mysql-server mysql-client

#Creat databases and user then grant privaleges
mysql -uroot -p$DBPASSWD -e "CREATE DATABASE $DBNAME"
mysql -uroot -p$DBPASSWD -e "CREATE USER '$DBUSER'@'localhost' IDENTIFIED BY '$DBPASSWD'"
mysql -uroot -p$DBPASSWD -e "GRANT ALL PRIVILEGES ON $DBNAME.* TO '$DBUSER'@'localhost'"
mysql -uroot -p$DBPASSWD -e "CREATE USER '$DBUSER'@'10.0.2.2' IDENTIFIED BY '$DBPASSWD'"
mysql -uroot -p$DBPASSWD -e "GRANT ALL PRIVILEGES ON $DBNAME.* TO '$DBUSER'@'10.0.2.2'"
mysql $DBNAME< ../../vagrant/src/sql/luonnit.sql -uroot -p$DBPASSWD
mysql $DBNAME< ../../vagrant/src/sql/Lumilaadut.sql -uroot -p$DBPASSWD
mysql $DBNAME< ../../vagrant/src/sql/Segmentit.sql -uroot -p$DBPASSWD
mysql $DBNAME< ../../vagrant/src/sql/Koordinaatit.sql -uroot -p$DBPASSWD
mysql $DBNAME< ../../vagrant/src/sql/Alalumilaadut.sql -uroot -p$DBPASSWD
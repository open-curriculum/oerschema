#!/usr/bin/env bash

apt-get update
apt-get install -y apache2 php5 php5-curl

if ! [ -L /var/www ]; then
  rm -rf /var/www
  ln -fs /vagrant /var/www
fi

if [ -L /etc/apache2/sites-enabled/000-default.conf ]; then
  a2dissite 000-default
fi

if ! [ -L /etc/apache2/sites-available/default.conf ]; then
  ln -s /vagrant/vagrant/sites-available/default.conf /etc/apache2/sites-available/default.conf
fi

a2ensite default

if ! [ -L /etc/php.ini ]; then
  rm -rf /etc/php.ini
  ln -fs /vagrant/php/php.ini /etc/php.ini
else
  ln -fs /vagrant/php/php.ini /etc/php.ini
fi

service apache2 start
update-rc.d apache2 defaults
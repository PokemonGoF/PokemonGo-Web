# Disclaimer
©2016 Niantic, Inc. ©2016 Pokémon. ©1995–2016 Nintendo / Creatures Inc. / GAME FREAK inc. © 2016 Pokémon/Nintendo Pokémon and Pokémon character names are trademarks of Nintendo. The Google Maps Pin is a trademark of Google Inc. and the trade dress in the product design is a trademark of Google Inc. under license to The Pokémon Company. Other trademarks are the property of their respective owners.
[Privacy Policy](http://www.pokemon.com/us/privacy-policy/)

[PokemonGo-Bot](https://github.com/PokemonGoF/PokemonGo-Bot) is intended for academic purposes and should not be used to play the game *PokemonGo* as it violates the TOS and is unfair to the community. Use the bot **at your own risk**.

[PokemonGoF](https://github.com/PokemonGoF) does not support the use of 3rd party apps or apps that violate the TOS.

# OpenPoGoBotWeb
Web View for OpenPoGoBot and PokemonGo-Bot  

## Installation and Use
This project is a module of OpenPogoBot and PokemonGo-Bot.  
In case the module version has not been updated on those projects, you can run the following to update it:

```
$ cd OpenPoGoBot  
$ git submodule foreach git pull origin master  
```  

In the event that there is nothing in your web folder and the above doesn't do anything run the following:  

``` 
$ cd OpenPoGoBot  
$ git submodule init  
$ git submodule update  
```

Copy the userdata.js.example to userdata.js and update your settings  
YOU WILL NEED A GOOGLE MAPS API KEY   [Get one here](https://developers.google.com/maps/documentation/javascript/get-api-key)  

If you want to serve this as a webpage you will have to set up a webserver, for example:

```
$ cd OpenPoGoBot\web  
$ python -m SimpleHTTPServer
```  

This will enable you to view your page on [http://localhost:8000](http://localhost:8000)  

## Contributing
If you would like to contribute please review OpenPoGo's [contributing](https://github.com/OpenPoGo/OpenPoGoBot/blob/master/CONTRIBUTING.md) guidelines and submit a pull request.  

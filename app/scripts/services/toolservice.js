'use strict';

/**
 * @ngdoc service
 * @name pokemonGoWebViewApp.ToolService
 * @description
 * # ToolService
 * Service in the pokemonGoWebViewApp.
 */
angular.module('pokemonGoWebViewApp')
  .service('ToolService', function () {
    var pokemonData = {
      1: "Bulbasaur",
      2: "Ivysaur",
      3: "Venusaur",
      4: "Charmander",
      5: "Charmeleon",
      6: "Charizard",
      7: "Squirtle",
      8: "Wartortle",
      9: "Blastoise",
      10: "Caterpie",
      11: "Metapod",
      12: "Butterfree",
      13: "Weedle",
      14: "Kakuna",
      15: "Beedrill",
      16: "Pidgey",
      17: "Pidgeotto",
      18: "Pidgeot",
      19: "Rattata",
      20: "Raticate",
      21: "Spearow",
      22: "Fearow",
      23: "Ekans",
      24: "Arbok",
      25: "Pikachu",
      26: "Raichu",
      27: "Sandshrew",
      28: "Sandslash",
      29: "Nidoran F",
      30: "Nidorina",
      31: "Nidoqueen",
      32: "Nidoran M",
      33: "Nidorino",
      34: "Nidoking",
      35: "Clefairy",
      36: "Clefable",
      37: "Vulpix",
      38: "Ninetales",
      39: "Jigglypuff",
      40: "Wigglytuff",
      41: "Zubat",
      42: "Golbat",
      43: "Oddish",
      44: "Gloom",
      45: "Vileplume",
      46: "Paras",
      47: "Parasect",
      48: "Venonat",
      49: "Venomoth",
      50: "Diglett",
      51: "Dugtrio",
      52: "Meowth",
      53: "Persian",
      54: "Psyduck",
      55: "Golduck",
      56: "Mankey",
      57: "Primeape",
      58: "Growlithe",
      59: "Arcanine",
      60: "Poliwag",
      61: "Poliwhirl",
      62: "Poliwrath",
      63: "Abra",
      64: "Kadabra",
      65: "Alakazam",
      66: "Machop",
      67: "Machoke",
      68: "Machamp",
      69: "Bellsprout",
      70: "Weepinbell",
      71: "Victreebel",
      72: "Tentacool",
      73: "Tentacruel",
      74: "Geodude",
      75: "Graveler",
      76: "Golem",
      77: "Ponyta",
      78: "Rapidash",
      79: "Slowpoke",
      80: "Slowbro",
      81: "Magnemite",
      82: "Magneton",
      83: "Farfetch'd",
      84: "Doduo",
      85: "Dodrio",
      86: "Seel",
      87: "Dewgong",
      88: "Grimer",
      89: "Muk",
      90: "Shellder",
      91: "Cloyster",
      92: "Gastly",
      93: "Haunter",
      94: "Gengar",
      95: "Onix",
      96: "Drowzee",
      97: "Hypno",
      98: "Krabby",
      99: "Kingler",
      100: "Voltorb",
      101: "Electrode",
      102: "Exeggcute",
      103: "Exeggutor",
      104: "Cubone",
      105: "Marowak",
      106: "Hitmonlee",
      107: "Hitmonchan",
      108: "Lickitung",
      109: "Koffing",
      110: "Weezing",
      111: "Rhyhorn",
      112: "Rhydon",
      113: "Chansey",
      114: "Tangela",
      115: "Kangaskhan",
      116: "Horsea",
      117: "Seadra",
      118: "Goldeen",
      119: "Seaking",
      120: "Staryu",
      121: "Starmie",
      122: "Mr. Mime",
      123: "Scyther",
      124: "Jynx",
      125: "Electabuzz",
      126: "Magmar",
      127: "Pinsir",
      128: "Tauros",
      129: "Magikarp",
      130: "Gyarados",
      131: "Lapras",
      132: "Ditto",
      133: "Eevee",
      134: "Vaporeon",
      135: "Jolteon",
      136: "Flareon",
      137: "Porygon",
      138: "Omanyte",
      139: "Omastar",
      140: "Kabuto",
      141: "Kabutops",
      142: "Aerodactyl",
      143: "Snorlax",
      144: "Articuno",
      145: "Zapdos",
      146: "Moltres",
      147: "Dratini",
      148: "Dragonair",
      149: "Dragonite",
      150: "Mewtwo",
      151: "Mew"
    };

    var itemData = {
      "0": "Unknown",
      "1": "Pokeball",
      "2": "Greatball",
      "3": "Ultraball",
      "4": "Masterball",
      "101": "Potion",
      "102": "Super Potion",
      "103": "Hyper Potion",
      "104": "Max Potion",
      "201": "Revive",
      "202": "Max Revive",
      "301": "Lucky Egg",
      "401": "Incense",
      "402": "Spicy Incense",
      "403": "Cool Incense",
      "404": "Floral Incense",
      "501": "Troy Disk",
      "602": "X Attack",
      "603": "X Defense",
      "604": "X Miracle",
      "701": "Razz Berry",
      "702": "Bluk Berry",
      "703": "Nanab Berry",
      "704": "Wepar Berry",
      "705": "Pinap Berry",
      "801": "Special Camera",
      "901": "Incubator (Unlimited)",
      "902": "Incubator",
      "1001": "Pokemon Storage Upgrade",
      "1002": "Item Storage Upgrade"
    };


    var levelXpArray = [
        {
          "level": 1,
          "exp_to_next_level": 1000,
          "current_level_xp": 0
        },
        {
          "level": 2,
          "exp_to_next_level": 2000,
          "current_level_xp": 1000
        },
        {
          "level": 3,
          "exp_to_next_level": 3000,
          "current_level_xp": 3000
        },
        {
          "level": 4,
          "exp_to_next_level": 4000,
          "current_level_xp": 6000
        },
        {
          "level": 5,
          "exp_to_next_level": 5000,
          "current_level_xp": 10000
        },
        {
          "level": 6,
          "exp_to_next_level": 6000,
          "current_level_xp": 15000
        },
        {
          "level": 7,
          "exp_to_next_level": 7000,
          "current_level_xp": 21000
        },
        {
          "level": 8,
          "exp_to_next_level": 8000,
          "current_level_xp": 28000
        },
        {
          "level": 9,
          "exp_to_next_level": 9000,
          "current_level_xp": 36000
        },
        {
          "level": 10,
          "exp_to_next_level": 10000,
          "current_level_xp": 45000
        },
        {
          "level": 11,
          "exp_to_next_level": 10000,
          "current_level_xp": 55000
        },
        {
          "level": 12,
          "exp_to_next_level": 10000,
          "current_level_xp": 65000
        },
        {
          "level": 13,
          "exp_to_next_level": 10000,
          "current_level_xp": 75000
        },
        {
          "level": 14,
          "exp_to_next_level": 15000,
          "current_level_xp": 85000
        },
        {
          "level": 15,
          "exp_to_next_level": 20000,
          "current_level_xp": 100000
        },
        {
          "level": 16,
          "exp_to_next_level": 20000,
          "current_level_xp": 120000
        },
        {
          "level": 17,
          "exp_to_next_level": 20000,
          "current_level_xp": 140000
        },
        {
          "level": 18,
          "exp_to_next_level": 25000,
          "current_level_xp": 160000
        },
        {
          "level": 19,
          "exp_to_next_level": 25000,
          "current_level_xp": 185000
        },
        {
          "level": 20,
          "exp_to_next_level": 50000,
          "current_level_xp": 210000
        },
        {
          "level": 21,
          "exp_to_next_level": 75000,
          "current_level_xp": 260000
        },
        {
          "level": 22,
          "exp_to_next_level": 100000,
          "current_level_xp": 335000
        },
        {
          "level": 23,
          "exp_to_next_level": 125000,
          "current_level_xp": 435000
        },
        {
          "level": 24,
          "exp_to_next_level": 150000,
          "current_level_xp": 560000
        },
        {
          "level": 25,
          "exp_to_next_level": 190000,
          "current_level_xp": 710000
        },
        {
          "level": 26,
          "exp_to_next_level": 200000,
          "current_level_xp": 900000
        },
        {
          "level": 27,
          "exp_to_next_level": 250000,
          "current_level_xp": 1100000
        },
        {
          "level": 28,
          "exp_to_next_level": 300000,
          "current_level_xp": 1350000
        },
        {
          "level": 29,
          "exp_to_next_level": 350000,
          "current_level_xp": 1650000
        },
        {
          "level": 30,
          "exp_to_next_level": 500000,
          "current_level_xp": 2000000
        },
        {
          "level": 31,
          "exp_to_next_level": 500000,
          "current_level_xp": 2500000
        },
        {
          "level": 32,
          "exp_to_next_level": 750000,
          "current_level_xp": 3000000
        },
        {
          "level": 33,
          "exp_to_next_level": 1000000,
          "current_level_xp": 3750000
        },
        {
          "level": 34,
          "exp_to_next_level": 1250000,
          "current_level_xp": 4750000
        },
        {
          "level": 35,
          "exp_to_next_level": 1500000,
          "current_level_xp": 6000000
        },
        {
          "level": 36,
          "exp_to_next_level": 2000000,
          "current_level_xp": 7500000
        },
        {
          "level": 37,
          "exp_to_next_level": 2500000,
          "current_level_xp": 9500000
        },
        {
          "level": 38,
          "exp_to_next_level": 3000000,
          "current_level_xp": 12000000
        },
        {
          "level": 39,
          "exp_to_next_level": 5000000,
          "current_level_xp": 15000000
        },
        {
          "level": 40,
          "exp_to_next_level": 0,
          "current_level_xp": 20000000
        }
      ];

    return {
      toThreeDigits: function (n) {
        var z = z || '0';
        var n = n + '';
        return n.length >= 3 ? n : new Array(3 - n.length + 1).join(z) + n;
      },
      pokemonById: function(id){
        return pokemonData[id];
      },
      getLevelPercent: function(level, exp){
        return Math.round((          ((exp - levelXpArray[level - 1].current_level_xp) / levelXpArray[level - 1].exp_to_next_level) * 100) * 100) / 100
      },
      pokemonData: function(){

        return pokemonData;
      },
      getItemById: function(id){
        return itemData[id]
      }
    }
  });

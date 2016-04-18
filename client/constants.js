// width in pixels of a small planet tile
var sWid = 212;
var agtWid = 100;
var agtSpace = 5;

// var offline = false; // checked by loader when creating settings for LoadQueue
// var s3url = 'https://s3-us-west-2.amazonaws.com/alien-empire/';
var offline = true;
var s3url = 'images/'; // set s3url to this if testing offline

var DROP_DIST = 50;
var MOVE_DISTANCE = 200;
var MENU_ON = 1;
var MENU_OFF = 2;

var GAME_CLOSED = 0;
var GAME_STAGING = 1;
var GAME_PROGRESS = 2;

var PHS_PLACING = -1;
var PHS_MISSIONS = 0;
var PHS_RESOURCE = 1;
var PHS_UPKEEP = 2;
var PHS_BUILD = 3;
var PHS_ACTIONS = 4;

var PHS_ENGLISH = {
	'-1': 'Placing Mines',
	0: 'Missions',
	1: 'Resources',
	2: 'Upkeep',
	3: 'Build',
	4: 'Actions'
};

var USR_OFFLINE = 0;
var USR_ONLINE = 1;
var USR_STAGING = 2;
var USR_INGAME = 3;

var MSG_SERVER = -1;
var MSG_ACTION = -2;

var NUM_FLEETS = 3;

var RES_METAL = 0;
var RES_WATER = 1;
var RES_FUEL = 2;
var RES_FOOD = 3;
var RES_NONE = 4;

var PKG_COLLECT = 1;
var PKG_TRADE = 2;
var PKG_SPY = 3;
var PKG_ENVOY = 4;
var PKG_MINER = 5;
var PKG_SMUGGLER = 6;
var PKG_UPKEEP = 7;
var PKG_BUILD = 8;

// Border status constants
var BRD_UNEXPLORED = 0;
var BRD_OPEN = 1;
var BRD_BLOCKED = 2;

// Action type values. All normal game actions must be greater than 0,
// Or certain logic (like updateTileInteractivity) will fail
var ACT_LOADED_ASSETS = 0;
var ACT_TURN_DONE = 1;
var ACT_PLACE = 2; // build anywhere, no payment
var ACT_BUILD = 3;
var ACT_RECRUIT = 4;
var ACT_REMOVE_FLEET = 5;
var ACT_REMOVE = 6;
var ACT_RETIRE = 7;
var ACT_MOVE_AGENT = 8;
var ACT_LAUNCH_MISSION = 9;
var ACT_COLLECT_RESOURCES = 10;
var ACT_PAY_UPKEEP = 11;
var ACT_VIEWED_MISSIONS = 12;
var ACT_BLOCK_MISSION = 13;
var ACT_MISSION_RESOLVE = 14;
var ACT_MISSION_VIEWED = 15;
var ACT_TRADE_FOUR_TO_ONE = 16;
var ACT_TRADE_REQUEST = 17;
var ACT_TRADE_CANCEL = 18;
var ACT_TRADE_ACCEPT = 19;
var ACT_TRADE_DECLINE = 20;
var ACT_FLEET_MOVE = 21;

var PNT_STRUCTURES = 0;
var PNT_EXPLORE = 1;
var PNT_ENVOY = 2;
var PNT_DESTROY = 3;
var PNT_TOTAL = 4;

var OBJ_MINE = 1;
var OBJ_FACTORY = 2;
var OBJ_EMBASSY = 3;
var OBJ_BASE = 4;
var OBJ_FLEET = 5;

var AGT_EXPLORER = 1;
var AGT_MINER = 2;
var AGT_SURVEYOR = 3;
var AGT_AMBASSADOR = 4;
var AGT_ENVOY = 5;
var AGT_SPY = 6;
var AGT_SMUGGLER = 7;
var AGT_SABATEUR = 8;

var AGT_STATUS_OFF = 0;
var AGT_STATUS_ON = 1;
var AGT_STATUS_DEAD = 2;

var AGT_IMG = {
					1: "explorer",
					2: "miner",
					3: "surveyor",
					4: "ambassador",
					5: "envoy",
					6: "spy",
					7: "smuggler",
					8: "sabateur" // fixing this misspelling will take work
};

var AGT_ENGLISH = {
					1: "Explorer",
					2: "Miner",
					3: "Surveyor",
					4: "Ambassador",
					5: "Envoy",
					6: "Spy",
					7: "Smuggler",
					8: "Saboteur"
};

var ACT_ENGLISH_PAST = {
					1: " finished turn",
					2: " placed a ",
					3: " built a new ",
					4: " recruited a new ",
					5: " removed their ",
					6: " removed their ",
					7: " retired their ",
					8: " moved their ",
					9: " launched a mission ",
					10: " collected resources",
					11: " paid upkeep",
					12: " viewed missions",
					13: " blocked a mission",
					14: " resolved their mission",
					15: " viewed the current mission",
					16: " did a 4 to 1 trade",
					17: " requested a trade",
					18: " cancelled a trade request",
					19: " accepted a trade request",
					20: " declined a trade request",
					21: " moved a fleet"
				};

// DON'T CAPITALIZE THESE. USED FOR DOM CLASS NAMES
var RES_ENGLISH = { 
					0: "metal", 
					1: "water", 
					2: "fuel", 
					3: "food",
					4: "" 
				};

var OBJ_ENGLISH = {
					1: "mine",
					2: "factory",
					3: "embassy",
					4: "base",
					5: "fleet"
				};

var COL_ENGLISH = {
					0: "Red",
					1: "Blue",
					2: "Green",
					3: "Yellow"
				};

// lists of required parameters to be met for each action type
var ACTION_REQUIREMENTS = {
	1: [],
	2: ['actiontype','objecttype','planetid','resourceid'],
	3: ['actiontype','objecttype','planetid','resourceid'],
	4: ['actiontype','agenttype','planetid'],
	5: ['actiontype', 'objecttype', 'planetid', 'targetid'],
	6: ['actiontype', 'objecttype', 'planetid', 'resourceid'],
	8: ['actiontype', 'agenttype', 'planetid'],
	9: ['actiontype', 'agenttype', 'planetid'],
	14: ['actiontype', 'agenttype', 'planetid'],
	21: ['actiontype', 'planetid', 'targetid']
};

var STRUCT_REQS = {
	1: { 
		build: [1,0,1,1],
		upkeep: [0,0,0,0],
		max: 4,
	}, 
	2: {

		build: [1,1,2,0],
		upkeep: [1,0,0,0],
		max: 3
	},
	3: {
		build: [2,2,0,1],
		upkeep: [0,1,0,0],
		max: 5
	},
	4: {
		build: [3,1,1,1],
		upkeep: [0,0,1,0],
		max: 1
	},
	5: {
		build: [1,1,1,0],
		upkeep: [0,0,1,0],
		max: 3
	}
};
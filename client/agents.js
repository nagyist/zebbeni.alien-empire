
/** Agents.js contains all methods for initializing and drawing agents
 * All agents are drawn once and then hidden or shown based on their 
 * current planetid (either a number or undefined). 
 */

var initAgents = function() {

	//create container to store all agent shapes
	var agentsContainer = new createjs.Container();
	agentsContainer.name = 'agentsContainer';
	agentsContainer.mouseEnabled = true;
	agentsContainer.x = 0;
	agentsContainer.y = 0;

	for( var agentid in clientGame.game.board.agents ) {

		var agent = clientGame.game.board.agents[agentid];
		var agenttype = agent.agenttype;
		var player = agent.player;

		var agentContainer = new createjs.Container();

		agentContainer.name = AGT_ENGLISH[ agenttype ] + player;
		agentContainer.agenttype = agenttype;

		var agentshape = new createjs.Shape();
		var agentImg = loader.getResult( AGT_IMG[ agenttype ] + player );
		agentshape.graphics.beginBitmapFill(agentImg, "no-repeat").drawRect(0, 0, 103, 103);
		agentshape.shadow = new createjs.Shadow("rgba(0,0,0,0.5)", 2, 2, 1);

		agentshape.scaleX = 0.85;
		agentshape.scaleY = 0.85;

		var agenttext = new createjs.Text(AGT_ENGLISH[ agenttype ], "normal 18px Play", "white");
		agenttext.name = "agenttext";
		agenttext.textAlign = "center";
		agenttext.x = 43;
		agenttext.y = 65;
		agenttext.shadow = new createjs.Shadow("rgba(0,0,0,0.8)", 3, 3, 1);

		agentContainer.visible = false;
		agentContainer.mouseEnabled = false;

		agentContainer.on("mouseover", function() {
			selectAgent( this.name );
		});

		agentContainer.on("mouseout", function() {
			hideSelection();
		});

		agentContainer.on("click", function() {
			handleClickAgent( this.agenttype )
		});

		agentContainer.addChild( agentshape );
		agentContainer.addChild( agenttext );

		agentsContainer.addChild(agentContainer);
	}

	board.addChild(agentsContainer);
};

var updateAgents = function(planetid) {

	var agentsContainer = board.getChildByName('agentsContainer');
	var planet = clientGame.game.board.planets[planetid];
	var agents = clientGame.game.board.agents;
	var num_agents = planet.agents.length;

	var space = agtSpace;
	var agtWidAll = (agtWid * num_agents) + (space * (num_agents - 1));

	if (agtWidAll > planet.w * sWid) {
		space = ((planet.w * sWid) - (num_agents * agtWid)) / (num_agents - 1);
		agtWidAll = (agtWid * num_agents) + (space * (num_agents - 1));
	}

	var agentsX = ((planet.w * sWid) / 2.0) - ( agtWidAll / 2.0);
	var agentsY = planet.w == 1 ? 15 : 155 ;

	for (var i = 0; i < num_agents; i++) {

		var id = planet.agents[i];
		var agent = agents[id];
		var player = agent.player;
		var agenttype = agent.agenttype;
		var agentname = AGT_ENGLISH[agenttype] + player;

		var agentContainer = agentsContainer.getChildByName(agentname);

		agentsContainer.setChildIndex( agentContainer, 
									   agentsContainer.getNumChildren() - 1);

		var newAgentX = tiles[planetid].x + agentsX;
		var newAgentY = tiles[planetid].y + agentsY;

		if( agentContainer.visible ){
			if ( newAgentX != agentContainer.x || Math.abs(newAgentY - agentContainer.y) < 50 ) {
				num_objects_moving += 1;
				createjs.Tween.get(agentContainer).to({ x:newAgentX, y:newAgentY}, 500 ).call(handleTweenComplete);
			}
		} 
		else {
			agentContainer.x = newAgentX;
			agentContainer.y = newAgentY;
			fadeIn(agentContainer, 500, true, false);
		}

		agentsX += agtWid + space;
	}
};

var updateDeadAgents = function() {

	var agents = clientGame.game.board.agents;
	var agentsContainer = board.getChildByName('agentsContainer');

	for ( var key in agents ){

		if ( agents[key].status != AGT_STATUS_ON ){
			
			var player = agents[key].player;
			var agenttype = agents[key].agenttype;

			var agentContainer = agentsContainer.getChildByName( AGT_ENGLISH[agenttype] + player );

			agentContainer.visible = false;
		}
	}
};

var updateAgentsInteractivity = function() {

	var agentsContainer = board.getChildByName('agentsContainer');

	switch ( clientGame.game.phase ) {
		case PHS_UPKEEP:
		case PHS_ACTIONS:
			mouseOnAgents( true );
			break;
		case PHS_PLACING:
		case PHS_MISSIONS:
		case PHS_RESOURCE:
		case PHS_BUILD:
		default:
			mouseOnAgents( false );
			break;
	}
};

var mouseOnAgents = function( on ) {
	var agentsContainer = board.getChildByName('agentsContainer');

	for ( var i = AGT_EXPLORER; i <= AGT_SABATEUR; i++ ){
		var agentContainer = agentsContainer.getChildByName( AGT_ENGLISH[i] 
														+ clientTurn );
		agentContainer.mouseEnabled = on;
	}
};

var handleClickAgent = function( agenttype ) {
	setPendingAgent( agenttype );
	switch ( clientGame.game.phase ){
		case PHS_UPKEEP:
			updateAgentRetireMenu( agenttype );
			showAgentRetireMenu();
			break;
		case PHS_ACTIONS:
			updateActionMenu( 'agent', agenttype );
			showActionMenu();
			break;
		default:
			break;
	}
};

var showAgentRetireMenu = function() {
	$('#agent-retire-div')[0].style.visibility = "visible";
};

var hideAgentRetireMenu = function() {
	$('#agent-retire-div')[0].style.visibility = "hidden";
};

var updateAgentRetireMenu = function( agenttype ){
	$('#agent-retire-name')[0].innerHTML = AGT_ENGLISH[agenttype];
	$('#agent-retire-button').click( function() { 
											hideAgentRetireMenu();
											setPendingAction( ACT_RETIRE );
											displayConfirmMenu();
										} );
};

var selectAgent = function( agentname) {
	var agentsContainer = board.getChildByName('agentsContainer');
	var agentContainer = agentsContainer.getChildByName( agentname );
	setSelection(agentContainer.x + 20, agentContainer.y - 28);
};
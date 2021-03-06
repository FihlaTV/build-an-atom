// Copyright 2013-2019, University of Colorado Boulder

/**
 * Main view for the second tab of the Build an Atom simulation.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const BAAGameModel = require( 'BUILD_AN_ATOM/game/model/BAAGameModel' );
  const BAAGameState = require( 'BUILD_AN_ATOM/game/model/BAAGameState' );
  const BAAQueryParameters = require( 'BUILD_AN_ATOM/common/BAAQueryParameters' );
  const BAARewardNode = require( 'BUILD_AN_ATOM/game/view/BAARewardNode' );
  const buildAnAtom = require( 'BUILD_AN_ATOM/buildAnAtom' );
  const FiniteStatusBar = require( 'VEGAS/FiniteStatusBar' );
  const GameAudioPlayer = require( 'VEGAS/GameAudioPlayer' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LevelCompletedNode = require( 'VEGAS/LevelCompletedNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const ShredConstants = require( 'SHRED/ShredConstants' );
  const StartGameLevelNode = require( 'BUILD_AN_ATOM/game/view/StartGameLevelNode' );

  /**
   * Constructor.
   *
   * @param {BAAGameModel} gameModel
   * @param {Tandem} tandem
   * @constructor
   */
  function BAAGameScreenView( gameModel, tandem ) {


    ScreenView.call( this, {
      layoutBounds: ShredConstants.LAYOUT_BOUNDS,
      tandem: tandem
    } );
    const self = this;

    // Add a root node where all of the game-related nodes will live.
    const rootNode = new Node();
    self.addChild( rootNode );

    const startGameLevelNode = new StartGameLevelNode(
      gameModel,
      this.layoutBounds,
      tandem.createTandem( 'startGameLevelNode' )
    );

    const scoreboard = new FiniteStatusBar(
      this.layoutBounds,
      this.visibleBoundsProperty,
      gameModel.scoreProperty,
      {
        challengeIndexProperty: gameModel.challengeIndexProperty,
        numberOfChallengesProperty: new Property( BAAGameModel.CHALLENGES_PER_LEVEL ),
        elapsedTimeProperty: gameModel.elapsedTimeProperty,
        timerEnabledProperty: gameModel.timerEnabledProperty,
        barFill: 'rgb( 49, 117, 202 )',
        textFill: 'white',
        xMargin: 20,
        dynamicAlignment: false,
        levelVisible: false,
        challengeNumberVisible: false,
        startOverButtonOptions: {
          font: new PhetFont( 20 ),
          textFill: 'black',
          baseColor: '#e5f3ff',
          xMargin: 6,
          yMargin: 5,
          listener: function() { gameModel.newGame(); }
        },
        tandem: tandem.createTandem( 'scoreboard' )
      }
    );

    scoreboard.centerX = this.layoutBounds.centerX;
    scoreboard.top = 0;
    const gameAudioPlayer = new GameAudioPlayer( gameModel.soundEnabledProperty );
    this.rewardNode = null;
    this.levelCompletedNode = null; // @private

    // Monitor the game state and update the view accordingly.
    gameModel.stateProperty.link( function( state, previousState ) {

      ( previousState && previousState.disposeEmitter ) && previousState.disposeEmitter.emit();

      if ( state === BAAGameState.CHOOSING_LEVEL ) {
        rootNode.removeAllChildren();
        rootNode.addChild( startGameLevelNode );
        if ( self.rewardNode !== null ) {
          self.rewardNode.dispose();
        }
        if ( self.levelCompletedNode !== null ) {
          self.levelCompletedNode.dispose();
        }
        self.rewardNode = null;
        self.levelCompletedNode = null;
      }
      else if ( state === BAAGameState.LEVEL_COMPLETED ) {
        rootNode.removeAllChildren();
        if ( gameModel.scoreProperty.get() === BAAGameModel.MAX_POINTS_PER_GAME_LEVEL || BAAQueryParameters.reward ) {

          // Perfect score, add the reward node.
          self.rewardNode = new BAARewardNode( tandem.createTandem( 'rewardNode' ) );
          rootNode.addChild( self.rewardNode );

          // Play the appropriate audio feedback
          gameAudioPlayer.gameOverPerfectScore();
        }
        else if ( gameModel.scoreProperty.get() > 0 ) {
          gameAudioPlayer.gameOverImperfectScore();
        }

        if ( gameModel.provideFeedbackProperty.get() ) {

          // Add the dialog node that indicates that the level has been completed.
          self.levelCompletedNode = new LevelCompletedNode(
            gameModel.levelProperty.get() + 1,
            gameModel.scoreProperty.get(),
            BAAGameModel.MAX_POINTS_PER_GAME_LEVEL,
            BAAGameModel.CHALLENGES_PER_LEVEL,
            gameModel.timerEnabledProperty.get(),
            gameModel.elapsedTimeProperty.get(),
            gameModel.bestTimes[ gameModel.levelProperty.get() ].value,
            gameModel.newBestTime,
            function() { gameModel.stateProperty.set( BAAGameState.CHOOSING_LEVEL ); }, {
              centerX: self.layoutBounds.width / 2,
              centerY: self.layoutBounds.height / 2,
              levelVisible: false,
              maxWidth: self.layoutBounds.width,
              tandem: tandem.createTandem( 'levelCompletedNode' )
            }
          );
          rootNode.addChild( self.levelCompletedNode );
        }
      }
      else if ( typeof( state.createView ) === 'function' ) {
        // Since we're not in the start or game-over states, we must be
        // presenting a challenge.
        rootNode.removeAllChildren();
        const challengeView = state.createView( self.layoutBounds, tandem.createTandem( state.tandem.name + 'View' ) );
        state.disposeEmitter.addListener( function disposeListener() {
          challengeView.dispose();
          state.disposeEmitter.removeListener( disposeListener );
        } );
        rootNode.addChild( challengeView );
        rootNode.addChild( scoreboard );
      }
    } );
  }

  buildAnAtom.register( 'BAAGameScreenView', BAAGameScreenView );

  // Inherit from ScreenView.
  return inherit( ScreenView, BAAGameScreenView, {

    // @public - step function for the view, called by the framework
    step: function( elapsedTime ) {
      if ( this.rewardNode ) {
        this.rewardNode.step( elapsedTime );
      }
    }
  } );
} );
// Copyright 2013-2019, University of Colorado Boulder

/**
 * Node for entering numbers of protons, neutrons, electrons.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const buildAnAtom = require( 'BUILD_AN_ATOM/buildAnAtom' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberAtom = require( 'SHRED/model/NumberAtom' );
  const NumberEntryNode = require( 'BUILD_AN_ATOM/game/view/NumberEntryNode' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const electronsColonString = require( 'string!BUILD_AN_ATOM/electronsColon' );
  const neutronsColonString = require( 'string!BUILD_AN_ATOM/neutronsColon' );
  const protonsColonString = require( 'string!BUILD_AN_ATOM/protonsColon' );

  // constants
  const MAX_WIDTH = 200;

  /**
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function InteractiveParticleCountsNode( tandem, options ) {

    Node.call( this, options );

    options = merge( { font: new PhetFont( 24 ) }, options );

    this.numberAtom = new NumberAtom( { tandem: tandem.createTandem( 'numberAtom' ) } );

    const protonCountPrompt = new Text( protonsColonString, {
      font: options.font,
      maxWidth: MAX_WIDTH
    } );
    this.addChild( protonCountPrompt );
    const protonCountEntryNode = new NumberEntryNode(
      this.numberAtom.protonCountProperty,
      tandem.createTandem( 'protonCountEntryNode' ), {
        minValue: 0,
        maxValue: 99
      } );
    this.addChild( protonCountEntryNode );

    const neutronCountPrompt = new Text( neutronsColonString, {
      font: options.font,
      maxWidth: MAX_WIDTH
    } );
    this.addChild( neutronCountPrompt );
    const neutronCountEntryNode = new NumberEntryNode( this.numberAtom.neutronCountProperty,
      tandem.createTandem( 'neutronCountEntryNode' ), {
        minValue: 0,
        maxValue: 99
      } );
    this.addChild( neutronCountEntryNode );

    const electronCountPrompt = new Text( electronsColonString, {
      font: options.font,
      maxWidth: MAX_WIDTH
    } );
    this.addChild( electronCountPrompt );
    const electronCountEntryNode = new NumberEntryNode(
      this.numberAtom.electronCountProperty,
      tandem.createTandem( 'electronCountEntryNode' ), {
        minValue: 0,
        maxValue: 99
      } );
    this.addChild( electronCountEntryNode );

    // Layout
    const maxParticleLabelWidth = Math.max( Math.max( protonCountPrompt.width, neutronCountPrompt.width ), electronCountPrompt.width );

    const interLineSpacing = protonCountEntryNode.height; // Multiplier empirically determined.
    protonCountPrompt.left = 0;
    neutronCountPrompt.left = 0;
    electronCountPrompt.left = 0;
    protonCountEntryNode.top = 0;
    neutronCountEntryNode.top = protonCountEntryNode.centerY + interLineSpacing;
    electronCountEntryNode.top = neutronCountEntryNode.centerY + interLineSpacing;
    protonCountPrompt.centerY = protonCountEntryNode.centerY;
    neutronCountPrompt.centerY = neutronCountEntryNode.centerY;
    electronCountPrompt.centerY = electronCountEntryNode.centerY;
    protonCountEntryNode.left = maxParticleLabelWidth + protonCountPrompt.height;
    neutronCountEntryNode.left = protonCountEntryNode.left;
    electronCountEntryNode.left = protonCountEntryNode.left;

    // @private called by dispose
    this.disposeInteractiveParticlCountsNode = function() {
      electronCountEntryNode.dispose();
      neutronCountEntryNode.dispose();
      protonCountEntryNode.dispose();
      this.numberAtom.dispose();
    };
  }

  buildAnAtom.register( 'InteractiveParticleCountsNode', InteractiveParticleCountsNode );

  // Inherit from Node.
  return inherit( Node, InteractiveParticleCountsNode, {

    dispose: function() {
      this.disposeInteractiveParticlCountsNode( this );
      Node.prototype.dispose.call( this );
    }
  } );
} );

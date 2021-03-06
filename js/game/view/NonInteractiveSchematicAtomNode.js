// Copyright 2013-2019, University of Colorado Boulder

/**
 * A non-interactive representation of an atom where the individual sub-atomic particles are visible.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const AtomNode = require( 'SHRED/view/AtomNode' );
  const AtomView = require( 'BUILD_AN_ATOM/common/view/AtomView' );
  const buildAnAtom = require( 'BUILD_AN_ATOM/buildAnAtom' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Particle = require( 'SHRED/model/Particle' );
  const ParticleAtom = require( 'SHRED/model/ParticleAtom' );
  const ParticleView = require( 'SHRED/view/ParticleView' );
  const Property = require( 'AXON/Property' );

  /**
   * @param {NumberAtom} numberAtom
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @constructor
   */
  function NonInteractiveSchematicAtomNode( numberAtom, modelViewTransform, tandem ) {
    Node.call( this, { pickable: false } );

    // Add the electron shells.
    const particleAtom = new ParticleAtom( { tandem: tandem.createTandem( 'particleAtom' ) } );
    const atomNode = new AtomNode( particleAtom, modelViewTransform, {
      showElementNameProperty: new Property( false ),
      showNeutralOrIonProperty: new Property( false ),
      showStableOrUnstableProperty: new Property( false ),
      tandem: tandem.createTandem( 'atomNode' )
    } );
    this.addChild( atomNode );

    // Layer where the particles go.
    const particleLayer = new Node();
    this.addChild( particleLayer );

    // Utility function to create and add particles.
    const particleGroupTandem = tandem.createGroupTandem( 'particle' );
    const particleViewGroupTandem = tandem.createGroupTandem( 'particleView' );
    const particleViews = [];
    let modelParticles = []; // (phet-io) keep track for disposal
    const createAndAddParticles = function( particleType, number ) {
      _.times( number, function() {
        const particle = new Particle( particleType, {
          tandem: particleGroupTandem.createNextTandem(),
          maxZLayer: AtomView.NUM_NUCLEON_LAYERS - 1
        } );
        modelParticles.push( particle );
        particleAtom.addParticle( particle );
        const particleView = new ParticleView( particle, modelViewTransform, {
          tandem: particleViewGroupTandem.createNextTandem()
        } );
        particleLayer.addChild( particleView );
        particleViews.push( particleView );
      } );
    };

    // Create and add the individual particles.
    createAndAddParticles( 'proton', numberAtom.protonCountProperty.get() );
    createAndAddParticles( 'neutron', numberAtom.neutronCountProperty.get() );
    createAndAddParticles( 'electron', numberAtom.electronCountProperty.get() );
    particleAtom.moveAllParticlesToDestination();

    // Layer the particle views so that the nucleus looks good, with the
    // particles closer to the center being higher in the z-order.
    let particleViewsInNucleus = _.filter( particleLayer.children, function( particleView ) {
      return particleView.particle.destinationProperty.get().distance( particleAtom.positionProperty.get() ) < particleAtom.innerElectronShellRadius;
    } );

    if ( particleViewsInNucleus.length > 3 ) {
      particleViewsInNucleus = _.sortBy( particleViewsInNucleus, function( particleView ) {
        // Central nucleons should be in front
        return -particleView.particle.destinationProperty.get().distance( particleAtom.positionProperty.get() );
      } );
      particleViewsInNucleus.forEach( function( particleView ) {
        particleLayer.removeChild( particleView );
        particleLayer.addChild( particleView );
      } );
    }

    // @private called by dispose
    this.disposeNonInteractiveSchematicAtomNode = function() {
      particleViews.forEach( function( particleView ) {
        particleView.dispose();
      } );
      atomNode.dispose();
      particleAtom.dispose();
      particleLayer.children.forEach( function( particleView ) { particleView.dispose(); } );
      particleLayer.dispose();
      modelParticles.forEach( function( particle ) { particle.dispose(); } );
      modelParticles = [];
    };
  }

  buildAnAtom.register( 'NonInteractiveSchematicAtomNode', NonInteractiveSchematicAtomNode );

  // Inherit from Node.
  return inherit( Node, NonInteractiveSchematicAtomNode, {

    // @public
    dispose: function() {
      this.disposeNonInteractiveSchematicAtomNode();
      Node.prototype.dispose.call( this );
    }
  } );
} );

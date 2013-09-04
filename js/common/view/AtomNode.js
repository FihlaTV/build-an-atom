// Copyright 2002-2013, University of Colorado Boulder

/**
 * View representation of the atom.  Mostly, this is responsible for displaying
 * and updating the labels, since the atom itself is represented by particles,
 * which take care of themselves in the view.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  var AtomIdentifier = require( 'common/AtomIdentifier' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ElectronCloudView = require( 'common/view/ElectronCloudView' );
  var ElectronShellView = require( 'common/view/ElectronShellView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Property = require( 'AXON/Property' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param particleAtom Model that represents the atom, including particle positions
   * @param mvt Model-View transform
   * @param options
   * @constructor
   */
  function AtomNode( particleAtom, mvt, options ) {

    options = _.extend(
      {
        showCenterX: true,
        showElementNameProperty: new Property( true ),
        showNeutralOrIonProperty: new Property( true ),
        showStableOrUnstableProperty: new Property( true ),
        electronShellDepictionProperty: new Property( 'orbits' )
      },
      options
    );

    Node.call( this, options ); // Call super constructor.
    var thisAtomView = this;

    this.atom = particleAtom;
    this.mvt = mvt;

    // Create the X where the nucleus goes.
    if ( options.showCenterX ) {
      var sizeInPixels = mvt.modelToViewDeltaX( 20 );
      var center = mvt.modelToViewPosition( particleAtom.position );
      var centerMarker = new Shape();
      centerMarker.moveTo( center.x - sizeInPixels / 2, center.y - sizeInPixels / 2 );
      centerMarker.lineTo( center.x + sizeInPixels / 2, center.y + sizeInPixels / 2 );
      centerMarker.moveTo( center.x - sizeInPixels / 2, center.y + sizeInPixels / 2 );
      centerMarker.lineTo( center.x + sizeInPixels / 2, center.y - sizeInPixels / 2 );
      var atomCenterMarker = new Path( centerMarker, {
        stroke: 'orange',
        lineWidth: 5
      } );
      this.addChild( atomCenterMarker );

      // Make the marker invisible if any nucleons are present.
      var listener = function() { atomCenterMarker.visible = particleAtom.getWeight() === 0; };
      particleAtom.electrons.lengthProperty.link( listener );
      particleAtom.neutrons.lengthProperty.link( listener );
      particleAtom.protons.lengthProperty.link( listener );
    }

    // Add the electron shells and cloud.
    var electronShell = new ElectronShellView( particleAtom, mvt );
    this.addChild( electronShell );
    var electronCloud = new ElectronCloudView( particleAtom, mvt );
    this.addChild( electronCloud );
    options.electronShellDepictionProperty.link( function( depiction ) {
      electronShell.visible = depiction === 'orbits';
      electronCloud.visible = depiction === 'cloud';
    } );

    // Create the textual readout for the element name.
    var elementNameCenterPos = mvt.modelToViewPosition( particleAtom.position.plus( new Vector2( 0, particleAtom.innerElectronShellRadius / 2 ) ) );
    var elementNameFontSize = mvt.modelToViewDeltaX( particleAtom.innerElectronShellRadius ) * 0.35;
    this.elementName = new Text( '',
      {
        font: new PhetFont( elementNameFontSize ),
        fill: 'red',
        center: elementNameCenterPos
      } );
    this.addChild( this.elementName );

    // Define the update function for the element name.
    var updateElementName = function() {
      var name = AtomIdentifier.getName( thisAtomView.atom.protons.length );
      if ( name.length === 0 ) {
        name = '';
      }
      thisAtomView.elementName.text = name;
      thisAtomView.elementName.setScaleMagnitude( 1 );
      var maxLabelWidth = mvt.modelToViewDeltaX( particleAtom.innerElectronShellRadius * 1.4 );
      thisAtomView.elementName.setScaleMagnitude( Math.min( maxLabelWidth / thisAtomView.elementName.width, 1 ) );
      thisAtomView.elementName.center = elementNameCenterPos;
    };
    updateElementName(); // Do the initial update.

    // Hook up update listeners.
    particleAtom.protons.lengthProperty.link( function() {
      updateElementName();
    } );
    options.showElementNameProperty.link( function( visible ) {
      thisAtomView.elementName.visible = visible;
    } );

    // Create the textual readout for the ion indicator.
    var ionIndicatorTranslation = mvt.modelToViewPosition( particleAtom.position.plus( new Vector2( particleAtom.outerElectronShellRadius * 1.05, 0 ).rotated( Math.PI * 0.40 ) ) );
    this.ionIndicator = new Text( '',
      {
        font: new PhetFont( 24 ),
        fill: 'black',
        translation: ionIndicatorTranslation
      } );
    this.addChild( this.ionIndicator );

    // Define the update function for the ion indicator.
    var updateIonIndicator = function() {
      if ( thisAtomView.atom.protons.length > 0 ) {
        var charge = thisAtomView.atom.getCharge();
        // TODO: i18n of all labels below
        if ( charge < 0 ) {
          thisAtomView.ionIndicator.text = '- Ion';
          thisAtomView.ionIndicator.fill = 'blue';
        }
        else if ( charge > 0 ) {
          thisAtomView.ionIndicator.text = '+ Ion';
          thisAtomView.ionIndicator.fill = 'red';
        }
        else {
          thisAtomView.ionIndicator.text = 'Neutral Atom';
          thisAtomView.ionIndicator.fill = 'black';
        }
      }
      else {
        // TODO: Make the text a zero-length string once supported.
        thisAtomView.ionIndicator.text = '';
        thisAtomView.ionIndicator.fill = 'black';
      }
    };
    updateIonIndicator(); // Do the initial update.

    particleAtom.protons.lengthProperty.link( updateIonIndicator );
    particleAtom.electrons.lengthProperty.link( updateIonIndicator );
    options.showNeutralOrIonProperty.link( function( visible ) {
      thisAtomView.ionIndicator.visible = visible;
    } );

    // Create the textual readout for the stability indicator.
    var stabilityIndicatorCenterPos = mvt.modelToViewPosition( Vector2.ZERO ).add( new Vector2( 0, 40 ) );
    this.stabilityIndicator = new Text( '',
      {
        font: new PhetFont( 24 ),
        fill: 'black',
        center: stabilityIndicatorCenterPos
      } );
    this.addChild( this.stabilityIndicator );

    // Define the update function for the stability indicator.
    var updateStabilityIndicator = function() {
      if ( thisAtomView.atom.protons.length > 0 ) {
        // TODO: i18n of the indicators below.
        if ( AtomIdentifier.isStable( thisAtomView.atom.protons.length, thisAtomView.atom.neutrons.length ) ) {
          thisAtomView.stabilityIndicator.text = 'Stable';
        }
        else {
          thisAtomView.stabilityIndicator.text = 'Unstable';
        }
      }
      else {
        // TODO: Make the text a zero-length string once supported.
        thisAtomView.stabilityIndicator.text = '';
      }
      thisAtomView.stabilityIndicator.center = stabilityIndicatorCenterPos;
    };
    updateStabilityIndicator(); // Do initial update.

    // Add the listeners that control the label content and visibility.
    particleAtom.protons.lengthProperty.link( function() {
      updateElementName();
      updateIonIndicator();
      updateStabilityIndicator();
    } );
    particleAtom.electrons.lengthProperty.link( updateIonIndicator );
    particleAtom.neutrons.lengthProperty.link( updateStabilityIndicator );
    options.showStableOrUnstableProperty.link( function( visible ) {
      thisAtomView.stabilityIndicator.visible = visible;
    } );
  }

  // Inherit from Node.
  inherit( Node, AtomNode );

  return AtomNode;
} );

// Copyright 2013-2019, University of Colorado Boulder

/**
 * Main view for the first screen of the Build an Atom simulation.
 */
define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const AtomView = require( 'BUILD_AN_ATOM/common/view/AtomView' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const buildAnAtom = require( 'BUILD_AN_ATOM/buildAnAtom' );
  const ChargeComparisonDisplay = require( 'BUILD_AN_ATOM/buildanatom/view/ChargeComparisonDisplay' );
  const ChargeMeter = require( 'BUILD_AN_ATOM/common/view/ChargeMeter' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MassNumberDisplay = require( 'BUILD_AN_ATOM/buildanatom/view/MassNumberDisplay' );
  const merge = require( 'PHET_CORE/merge' );
  const ShredConstants = require( 'SHRED/ShredConstants' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const massNumberString = require( 'string!BUILD_AN_ATOM/massNumber' );
  const netChargeString = require( 'string!BUILD_AN_ATOM/netCharge' );

  // constants
  const INTER_BOX_SPACING = 7;
  const ACCORDION_BOX_BUTTON_DILATION = 12;

  /**
   * Constructor.
   *
   * @param {BuildAnAtomModel} model Build an Atom model object.
   * @param {Tandem} tandem
   * @constructor
   */
  function BuildAnAtomView( model, tandem ) {
    AtomView.call( this, model, tandem );

    // @private - properties that are passed to the accordion boxes that control their expansion state
    this.netChargeAccordionBoxExpandedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'netChargeAccordionBoxExpandedProperty' )
    } );
    this.massNumberAccordionBoxExpandedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'massNumberAccordionBoxExpandedProperty' )
    } );

    // options that are common to all of the accordion boxes in this view
    const commonAccordionBoxOptions = {
      cornerRadius: 3,
      fill: ShredConstants.DISPLAY_PANEL_BACKGROUND_COLOR,
      contentAlign: 'left',
      titleAlignX: 'left',
      buttonAlign: 'right',
      minWidth: this.periodicTableAccordionBox.width,
      expandCollapseButtonOptions: {
        touchAreaXDilation: ACCORDION_BOX_BUTTON_DILATION,
        touchAreaYDilation: ACCORDION_BOX_BUTTON_DILATION
      }
    };

    // Add the charge meter and charge comparison display inside of an accordion box.
    const netChargeAccordionBoxContents = new HBox( {
      children: [
        new ChargeMeter( model.particleAtom, tandem.createTandem( 'chargeMeter' ) ),
        new ChargeComparisonDisplay(
          model.particleAtom,
          tandem.createTandem( 'chargeComparisonDisplay' ),
          { pickable: false }
        )
      ],
      spacing: 5,
      scale: 0.85, // empirically determined to keep the box height reasonable
      pickable: false,
      tandem: tandem.createTandem( 'netChargeAccordionBoxContents' ),

      // a11y
      tagName: 'h6',
      innerContent: 'Net Charge Content' // TODO: export to a11y strings file
    } );
    const netChargeAccordionBox = new AccordionBox(
      netChargeAccordionBoxContents,
      merge( {}, {
        titleNode: new Text( netChargeString, {
          font: ShredConstants.ACCORDION_BOX_TITLE_FONT,
          maxWidth: ShredConstants.ACCORDION_BOX_TITLE_MAX_WIDTH,
          tandem: tandem.createTandem( 'netChargeAccordionBoxTitle' )
        } ),
        expandedProperty: this.netChargeAccordionBoxExpandedProperty,

        // phet-io
        tandem: tandem.createTandem( 'netChargeAccordionBox' ),

        // a11y
        labelContent: netChargeString
      }, commonAccordionBoxOptions )
    );
    this.controlPanelLayer.addChild( netChargeAccordionBox );

    // Add the mass indicator inside of an accordion box.
    const massNumberDisplay = new MassNumberDisplay(
      model.particleAtom,
      tandem.createTandem( 'massNumberDisplay' ),
      {
        pickable: false,
        scale: 0.85, // empirically determined to make the control panels all fit on the screen

        // a11y
        tagName: 'h6',
        innerContent: 'Mass Number Content' // TODO: export to a11y strings file
      }
    );
    const massNumberAccordionBox = new AccordionBox(
      massNumberDisplay,
      merge( {}, {
        titleNode: new Text( massNumberString, {
          font: ShredConstants.ACCORDION_BOX_TITLE_FONT,
          maxWidth: ShredConstants.ACCORDION_BOX_TITLE_MAX_WIDTH,
          tandem: tandem.createTandem( 'massNumberAccordionBoxTitle' )
        } ),
        expandedProperty: this.massNumberAccordionBoxExpandedProperty,

        // phet-io
        tandem: tandem.createTandem( 'massNumberAccordionBox' ),

        // a11y
        labelContent: massNumberString
      }, commonAccordionBoxOptions )
    );
    this.controlPanelLayer.addChild( massNumberAccordionBox );

    // Do the layout.
    netChargeAccordionBox.right = this.periodicTableAccordionBox.right;
    netChargeAccordionBox.top = this.periodicTableAccordionBox.bottom + INTER_BOX_SPACING;
    massNumberAccordionBox.right = this.periodicTableAccordionBox.right;
    massNumberAccordionBox.top = netChargeAccordionBox.top + netChargeAccordionBox.height + INTER_BOX_SPACING;

    // a11y - set navigation order for the Atom screen view
    this.pdomPlayAreaNode.accessibleOrder = [ this.periodicTableAccordionBox, netChargeAccordionBox, massNumberAccordionBox ];
  }

  buildAnAtom.register( 'BuildAnAtomView', BuildAnAtomView );

  return inherit( AtomView, BuildAnAtomView, {

    /**
     * @public
     */
    reset: function() {
      AtomView.prototype.reset.call( this );
      this.netChargeAccordionBoxExpandedProperty.reset();
      this.massNumberAccordionBoxExpandedProperty.reset();
    }
  } );
} );

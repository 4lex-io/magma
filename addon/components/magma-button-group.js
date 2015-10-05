/**
 * You can assemble multiple buttons within a group. They will behave about the same way a radiobutton will work. This is very useful if you want to create a navigation bar, or a multi-panel with tabs for example.
 *
 * @class Magma.Component.ButtonGroup
 * @constructor
 * @uses Magma.Mixin.DisabledSupport
 * @extends Ember.Component
 * @example
 * ```
 * {{#magma-button-group name="buttonGroupHello" value=buttonGroupLangValue}}
 *   {{#magma-button name="buttonGroupHello" value="Bonjour" pressed=true}} Bonjour {{/magma-button}}
 *   {{#magma-button name="buttonGroupHello" value="Hola"}} Hola {{/magma-button}}
 *   {{#magma-button name="buttonGroupHello" value="Hello"}} Hello {{/magma-button}}
 * {{/magma-button-group}}
 * ```
 */

import Ember from 'ember';
import DisabledSupport from 'ember-magma/mixins/disabled-support';

const { computed, inject, on, observer } = Ember;

export default Ember.Component.extend(DisabledSupport, {

	attributeBindings: ['style'],

	classNames: ['magma-button-group'],

	magmaEvent: inject.service('magma-event'),

	/**
	 * @property name {String}
	 * @private
	 */
	name: computed.alias('attrs.name', function () {
		return this.getAttr('name');
	}),

	/**
	 * @property value {String}
	 * @private
	 */
	value: computed.alias('attrs.value', function () {
		return this.getAttr('value');
	}),

	attrs: {

		/**
		 * This is the action that will be called whenever the value of the group changes. The action will receive the value as a parameter.
		 * @property on-value-change {Function}
		 * @public
		 */
		'on-value-change': void 0,

		/**
		 * This name is mandatory and should be the same in the group and the button itself. It allows to share the events between the two components.
		 * @property name {String}
		 * @public
		 */
		name: void 0,

		/**
		 * You can set the value of the current pressed button with this attribute
		 * @property value {String}
		 * @public
		 */
		value: void 0
	},

	/**
	 * On init, initialize the event between the button and the button group.
	 * The method `triggerEvent` will be called after render.
	 * @method buttonInit
	 * @private
	 */
	buttonGroupInit: on('init', function () {
		let name = this.get('name');
		if (name) {
			this.get('magmaEvent').subscribe(name+'Button', this, 'buttonDidChange');
		}
		Ember.run.schedule('afterRender', this, this.triggerEvent);
	}),

	/**
	 * On willDestroyElement, teardown the event between the button and the button group.
	 * @method buttonGroupWillDestroyElement
	 * @private
	 */
	buttonGroupWillDestroyElement: on('willDestroyElement', function () {
		let name = this.get('name');
		if (name) {
			this.get('magmaEvent').unsubscribe(name+'Button');
		}
	}),

	/**
	 * Will send an event to the buttons when `name`, `value` or `disabled` change.
	 * @method triggerEvent
	 * @private
	 */
	triggerEvent: observer('name', 'value', 'disabled', function () {
		this.get('magmaEvent').publish(this.get('name')+'ButtonGroup', this.getProperties('value', 'disabled'));
	}),

	/**
	 * Fired when one button state did change. It sets the `value` to the new value.
	 * @event buttonDidChange
	 * @private
	 */
	buttonDidChange(event) {
		const onValueChangeAction = this.getAttr('on-value-change');
		if (onValueChangeAction) {
			onValueChangeAction(event.value);
		}
		this.set('value', event.value);
	}
});

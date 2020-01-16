let _ = require('lodash')
let t = require('tcomb-form-native')
let stylesheet = _.cloneDeep(t.form.Form.stylesheet)

stylesheet.controlLabel.normal.color = '#cccccc'
stylesheet.textbox.normal.color = '#cccccc'
stylesheet.textbox.normal.borderWidth = 0
stylesheet.textbox.error.borderWidth = 0
stylesheet.textbox.normal.marginBottom = 0
stylesheet.textbox.error.marginBottom = 0

stylesheet.textboxView.normal.borderWidth = 0
stylesheet.textboxView.error.borderWidth = 0
stylesheet.textboxView.normal.borderRadius = 0
stylesheet.textboxView.error.borderRadius = 0
stylesheet.textboxView.normal.borderBottomWidth = 1
stylesheet.textboxView.normal.borderBottomColor = '#8CAD81'
stylesheet.textboxView.error.borderBottomWidth = 0.5
stylesheet.textboxView.normal.marginBottom = 5
stylesheet.textboxView.error.marginBottom = 5

export default stylesheet
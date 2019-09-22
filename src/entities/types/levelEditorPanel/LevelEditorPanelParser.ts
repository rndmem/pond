import {LevelEditorPanel} from './LevelEditorPanel'
import {UpdaterParser} from '../../updaters/UpdaterParser'
import {EntityType} from '../../entityType/EntityType'
import {EntityID} from '../../entityID/EntityID'
import {EntityTypeUtil} from '../../entityType/EntityTypeUtil'
import {EntityUtil} from '../../entity/EntityUtil'
import {LevelEditorPanelUtil} from './LevelEditorPanelUtil'

export namespace LevelEditorPanelParser {
  export const parse: UpdaterParser = (panel, atlas, parser) => {
    if (
      !EntityTypeUtil.assert<LevelEditorPanel>(
        panel,
        EntityType.UI_LEVEL_EDITOR_PANEL
      )
    )
      throw new Error()
    const radioGroup = EntityUtil.find(
      panel,
      EntityID.UI_LEVEL_EDITOR_RADIO_GROUP
    )
    const xCheckbox = EntityUtil.find(panel, EntityID.UI_LEVEL_EDITOR_PANEL_X)
    const yCheckbox = EntityUtil.find(panel, EntityID.UI_LEVEL_EDITOR_PANEL_Y)
    const stateCheckbox = EntityUtil.find(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_STATE
    )
    const entityCheckbox = EntityUtil.find(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_ENTITY
    )
    const entityPicker = EntityUtil.find(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_ENTITY_PICKER
    )
    const decrementButton = EntityUtil.find(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_DECREMENT
    )
    const incrementButton = EntityUtil.find(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_INCREMENT
    )
    const removeButton = EntityUtil.find(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_REMOVE
    )
    const addButton = EntityUtil.find(panel, EntityID.UI_LEVEL_EDITOR_PANEL_ADD)
    const toggleGridButton = EntityUtil.find(
      panel,
      EntityID.UI_LEVEL_EDITOR_PANEL_TOGGLE_GRID
    )
    const ret = {
      ...panel,
      radioGroup,
      xCheckbox,
      yCheckbox,
      stateCheckbox,
      entityCheckbox,
      entityPicker,
      decrementButton,
      incrementButton,
      removeButton,
      addButton,
      toggleGridButton
    }
    LevelEditorPanelUtil.setEntityFields(
      <LevelEditorPanel>ret,
      0,
      atlas,
      parser
    )

    return ret
  }
}
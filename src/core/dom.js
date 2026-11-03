/* Referencias al DOM. Falla pronto si el HTML no contiene la estructura esperada. */
function byId(id) {
  const node = document.getElementById(id);
  if (!node) throw new Error(`[PromptCombo] Falta el nodo obligatorio #${id}.`);
  return node;
}

const builderStatus = document.querySelector('.builder-status');
if (!builderStatus) throw new Error('[PromptCombo] Falta el contenedor .builder-status.');

export const els = {
  catalogGroups: byId('catalogGroups'),
  catalogScroll: byId('catalogScroll'),
  catalogSearch: byId('catalogSearch'),
  catalogCount: byId('catalogCount'),
  catalogFooterMeta: byId('catalogFooterMeta'),
  noResults: byId('noResults'),
  clearSearchBtn: byId('clearSearchBtn'),
  clearSearchInline: byId('clearSearchInline'),
  focusSearchBtn: byId('focusSearchBtn'),
  loadDemoBtn: byId('loadDemoBtn'),
  persistBtn: byId('persistBtn'),
  resetBtn: byId('resetBtn'),
  clearComboBtn: byId('clearComboBtn'),
  advancedMeta: byId('advancedMeta'),
  studioConflict: byId('studioConflict'),
  studioConflictText: byId('studioConflictText'),
  conflictReloadBtn: byId('conflictReloadBtn'),
  conflictKeepBtn: byId('conflictKeepBtn'),
  conflictExportBtn: byId('conflictExportBtn'),
  sessionConflict: byId('sessionConflict'),
  sessionConflictText: byId('sessionConflictText'),
  sessionKeepBtn: byId('sessionKeepBtn'),
  sessionExportBtn: byId('sessionExportBtn'),
  builderCount: byId('builderCount'),
  builderStatusText: byId('builderStatusText'),
  builderStatus,
  variablesSection: byId('variablesSection'),
  variablesGrid: byId('variablesGrid'),
  variableCount: byId('variableCount'),
  resetVarsBtn: byId('resetVarsBtn'),
  sequenceArea: byId('sequenceArea'),
  emptyState: byId('emptyState'),
  comboList: byId('comboList'),
  sessionMeta: byId('sessionMeta'),
  previewOutput: byId('previewOutput'),
  previewLines: byId('previewLines'),
  charCount: byId('charCount'),
  blockCount: byId('blockCount'),
  variableWarning: byId('variableWarning'),
  copyBtn: byId('copyBtn'),
  downloadBtn: byId('downloadBtn'),
  toastRegion: byId('toastRegion'),
  detailDialog: byId('detailDialog'),
  detailType: byId('detailType'),
  detailTitle: byId('detailTitle'),
  detailCode: byId('detailCode'),
  detailContent: byId('detailContent'),
  detailClose: byId('detailClose'),
  detailAdd: byId('detailAdd')
};

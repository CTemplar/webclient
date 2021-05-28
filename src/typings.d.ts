/* SystemJS module definition */
interface NodeModule {
  id: string;
}

declare module 'cssfilter';
declare module 'bcryptjs';

declare module '@ckeditor/ckeditor5-build-decoupled-document' {
  const DecoupledEditorBuild: any;

  export = DecoupledEditorBuild;
}

declare module '@ckeditor/ckeditor5-inspector' {
  const CKEditorInspectorBuild: any;

  export = CKEditorInspectorBuild;
}

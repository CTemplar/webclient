/* SystemJS module definition */
interface NodeModule {
  id: string;
}

declare module 'cssfilter';
declare module 'quill-image-resize-module';
declare module 'bcryptjs';

declare module '@ckeditor/ckeditor5-build-decoupled-document' {
  const DecoupledEditorBuild: any;

  export = DecoupledEditorBuild;
}

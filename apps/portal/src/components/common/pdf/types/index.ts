export interface PDFViewerProps {

  open: boolean;

  url: string;

  title: string;

  onClose(): void;

  canDownload?: boolean;

  streaming?: boolean;

}

export interface PDFToolbarProps {

  page: number;

  pages: number;

  scale: number;

  setPage(value:number):void;

  setScale(value:number):void;

  blobUrl:string;

  title:string;

  onClose():void;

  canDownload?:boolean;

}

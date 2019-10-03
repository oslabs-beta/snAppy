import * as ts from 'typescript';
export interface Options {
    libraryName?: string;
    style?: boolean | 'css' | string | ((name: string) => string);
    libraryDirectory?: ((name: string) => string) | string;
    camel2DashComponentName?: boolean;
    camel2UnderlineComponentName?: boolean;
    transformToDefaultImport?: boolean;
    resolveContext?: string[];
}
export interface ImportedStruct {
    importName: string;
    variableName?: string;
}
export declare function createTransformer(_options?: Partial<Options> | Array<Partial<Options>>): ts.TransformerFactory<ts.SourceFile>;
export default createTransformer;

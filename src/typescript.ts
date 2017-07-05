/**
 * A re-exporting wrapper around the relevant parts of TypeScript.
 *
 * Note that the API documentation does not reference any re-exports because this isn't supported
 * by the documentation generator.
 *
 * For additional exports, see: https://github.com/dcodeIO/AssemblyScript/blob/master/src/typescript.ts
 *
 * @module assemblyscript/typescript
 */ /** */

import * as path from "path";
import * as reflection from "./reflection";
import * as ts from "../lib/typescript/build";
import * as library from "./library";

// With a little help of "Find all references" the following list aims to provide an answer to
// the interesting question "Which parts of TypeScript do we actually use, and where?".

export import ArrayTypeNode = ts.ArrayTypeNode;
export import AsExpression = ts.AsExpression;
export import BinaryExpression = ts.BinaryExpression;
export import Block = ts.Block;
export import BreakStatement = ts.BreakStatement;
export import CallExpression = ts.CallExpression;
export import ClassDeclaration = ts.ClassDeclaration;
       import CompilerHost = ts.CompilerHost;
       import CompilerOptions = ts.CompilerOptions;
export import ConditionalExpression = ts.ConditionalExpression;
export import ConstructorDeclaration = ts.ConstructorDeclaration;
export import ContinueStatement = ts.ContinueStatement;
export import DiagnosticCategory = ts.DiagnosticCategory;
export import DiagnosticCollection = ts.DiagnosticCollection;
export import DiagnosticMessage = ts.DiagnosticMessage;
export import Diagnostic = ts.Diagnostic;
export import DoStatement = ts.DoStatement;
export import ElementAccessExpression = ts.ElementAccessExpression;
export import EnumDeclaration = ts.EnumDeclaration;
export import EnumMember = ts.EnumMember;
export import EntityName = ts.EntityName;
export import ExpressionStatement = ts.ExpressionStatement;
export import Expression = ts.Expression;
       import FormatDiagnosticsHost = ts.FormatDiagnosticsHost;
export import ForStatement = ts.ForStatement;
export import FunctionBody = ts.FunctionBody;
export import FunctionLikeDeclaration = ts.FunctionLikeDeclaration;
export import FunctionDeclaration = ts.FunctionDeclaration;
export import Identifier = ts.Identifier;
export import IfStatement = ts.IfStatement;
export import LiteralExpression = ts.LiteralExpression;
export import MethodDeclaration = ts.MethodDeclaration;
       import ModifierFlags = ts.ModifierFlags;
       import ModuleKind = ts.ModuleKind;
export import NewExpression = ts.NewExpression;
export import NodeArray = ts.NodeArray;
export import NodeFlags = ts.NodeFlags;
export import Node = ts.Node;
export import ParameterDeclaration = ts.ParameterDeclaration;
export import ParenthesizedExpression = ts.ParenthesizedExpression;
export import PostfixUnaryExpression = ts.PostfixUnaryExpression;
export import PrefixUnaryExpression = ts.PrefixUnaryExpression;
export import Program = ts.Program;
export import PropertyAccessExpression = ts.PropertyAccessExpression;
export import PropertyDeclaration = ts.PropertyDeclaration;
export import Signature = ts.Signature;
export import TypeAliasDeclaration = ts.TypeAliasDeclaration;
export import TypeChecker = ts.TypeChecker;
export import TypeNode = ts.TypeNode;
export import TypeParameterDeclaration = ts.TypeParameterDeclaration;
export import TypeReferenceNode = ts.TypeReferenceNode;
export import TypeReference = ts.TypeReference;
export import Type = ts.Type;
export import VariableDeclaration = ts.VariableDeclaration;
export import VariableDeclarationList = ts.VariableDeclarationList;
export import VariableStatement = ts.VariableStatement;
export import ReturnStatement = ts.ReturnStatement;
       import ResolvedModule = ts.ResolvedModule;
export import ScriptTarget = ts.ScriptTarget;
export import SourceFile = ts.SourceFile;
export import Statement = ts.Statement;
export import SwitchStatement = ts.SwitchStatement;
export import Symbol = ts.Symbol;
export import SyntaxKind = ts.SyntaxKind;
export import WhileStatement = ts.WhileStatement;

export import getPreEmitDiagnostics = ts.getPreEmitDiagnostics;
export import getSourceFileOfNode = ts.getSourceFileOfNode;
export import getTextOfNode = ts.getTextOfNode;
export import createDiagnosticCollection = ts.createDiagnosticCollection;
       import createGetCanonicalFileName = ts.createGetCanonicalFileName;
export import createProgram = ts.createProgram;
export import createSourceFile = ts.createSourceFile;
       import resolveModuleName = ts.resolveModuleName;
       import sys = ts.sys;

/** Default format diagnostics host for convenience. */
export const defaultFormatDiagnosticsHost: FormatDiagnosticsHost = {
  getCurrentDirectory: () => sys.getCurrentDirectory(),
  getNewLine: () => sys.newLine,
  getCanonicalFileName: createGetCanonicalFileName(sys.useCaseSensitiveFileNames)
};

/** Default compiler options for AssemblyScript compilation. */
export const defaultCompilerOptions = <CompilerOptions>{
  target: ScriptTarget.Latest,
  module: ModuleKind.None,
  noLib: true,
  experimentalDecorators: true,
  types: []
};

/** Creates an AssemblyScript-compatible compiler host. */
export function createCompilerHost(moduleSearchLocations: string[], entryFileSource?: string, entryFileName: string = "module.ts"): CompilerHost {
  const files: { [key: string]: SourceFile } = {};
  if (typeof entryFileSource === "string")
    files[entryFileName] = createSourceFile(entryFileName, <string>entryFileSource, ScriptTarget.Latest);
  Object.keys(library.files).forEach(name => {
    files[name] = createSourceFile(name, library.files[name], ScriptTarget.Latest);
  });

  return {
    getSourceFile,
    getDefaultLibFileName: () => "assembly.d.ts",
    writeFile: (filename: string, content: string) => sys.writeFile(filename, content),
    getCurrentDirectory: () => sys.getCurrentDirectory(),
    getDirectories: (path: string) => sys.getDirectories(path),
    getCanonicalFileName: fileName => sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase(),
    getNewLine: () => sys.newLine,
    useCaseSensitiveFileNames: () => sys.useCaseSensitiveFileNames,
    fileExists,
    readFile,
    resolveModuleNames
  };

  function fileExists(fileName: string): boolean {
    return !!files[fileName] || sys.fileExists(fileName);
  }

  function readFile(fileName: string): string {
    return files[fileName] ? files[fileName].text : sys.readFile(fileName);
  }

  function getSourceFile(fileName: string, languageVersion: ScriptTarget, onError?: (message: string) => void): SourceFile {
    if (files[fileName])
      return files[fileName];
    const sourceText = sys.readFile(fileName);
    if (sourceText === undefined && onError)
      onError("file not found: " + fileName);
    return files[fileName] = createSourceFile(fileName, sourceText || "", languageVersion);
  }

  function resolveModuleNames(moduleNames: string[], containingFile: string): ResolvedModule[] {
    return <ResolvedModule[]>moduleNames.map(moduleName => {
      // try to use standard resolution
      const result = resolveModuleName(moduleName, containingFile, defaultCompilerOptions, { fileExists, readFile });
      if (result.resolvedModule)
        return result.resolvedModule;
      // check fallback locations, for simplicity assume that module at location should be represented by '.d.ts' file
      for (const location of moduleSearchLocations) {
        const modulePath = path.join(location, moduleName + ".d.ts");
        if (fileExists(modulePath))
          return { resolvedFileName: modulePath };
      }
      return undefined;
    });
  }
}

/** Creates a diagnostic message referencing a node. */
export function createDiagnosticForNode(node: Node, category: DiagnosticCategory, message: string, arg1?: string) {
  let realMessage = message;
  if (arg1 != null)
    realMessage += ": " + arg1;
  return /* override */ ts.createDiagnosticForNode(node, {
    key: message.toLowerCase().replace(/\s+/g, "_").replace(/[^\w]/g, ""),
    category: category,
    code: <any>"-AS",
    message: realMessage
  });
}

/** Formats a diagnostic message in plain text. */
export function formatDiagnostics(diagnostics: Diagnostic[], host?: FormatDiagnosticsHost) {
  return /* override */ ts.formatDiagnostics(diagnostics, host || defaultFormatDiagnosticsHost);
}

/** Formats a diagnostic message with terminal colors and source context. */
export function formatDiagnosticsWithColorAndContext(diagnostics: Diagnostic[], host?: FormatDiagnosticsHost) {
  return /* override */ ts.formatDiagnosticsWithColorAndContext(diagnostics, host || defaultFormatDiagnosticsHost);
}

/** Prints a diagnostic message to console. */
export function printDiagnostic(diagnostic: Diagnostic): void {
  if (typeof process !== "undefined" && process && process.stderr) {
    if (diagnostic.category === DiagnosticCategory.Message)
      process.stderr.write(formatDiagnostics([ diagnostic ], defaultFormatDiagnosticsHost));
    else
      process.stderr.write(formatDiagnosticsWithColorAndContext([ diagnostic ], defaultFormatDiagnosticsHost) + "\n");
  } else {
    if (diagnostic.category === DiagnosticCategory.Message)
      (console.info || console.log)(formatDiagnostics([ diagnostic ], defaultFormatDiagnosticsHost));
    else if (diagnostic.category === DiagnosticCategory.Warning)
      (console.warn || console.log)(formatDiagnostics([ diagnostic ], defaultFormatDiagnosticsHost));
    else
      (console.error || console.log)(formatDiagnostics([ diagnostic ], defaultFormatDiagnosticsHost));
  }
}

/** Tests if the specified node has an 'export' modifier. */
export function isExport(node: Node): boolean {
  if (node && node.modifiers)
    for (let i = 0, k = node.modifiers.length; i < k; ++i)
      if (node.modifiers[i].kind === SyntaxKind.ExportKeyword)
        return true;
  return false;
}

/** Tests if the specified node has a 'declare' modifier or is part of a class with a 'declare' modifier. */
export function isDeclare(node: Node): boolean {
  if (node && node.modifiers)
    for (let i = 0, k = node.modifiers.length; i < k; ++i)
      if (node.modifiers[i].kind === SyntaxKind.DeclareKeyword)
        return true;
  if (node.parent && node.parent.kind === SyntaxKind.ClassDeclaration)
    return isDeclare(node.parent);
  return false;
}

/** Tests if the specified node has a 'static' modifier or is otherwise part of a static context. */
export function isStatic(node: Node): boolean {
  return (<ModifierFlags>node.modifierFlagsCache & ModifierFlags.Static) !== 0;
}

/** Tests if the specified node has an 'abstract' modifier. */
export function isAbstract(node: Node): boolean {
  return (<ModifierFlags>node.modifierFlagsCache & ModifierFlags.Abstract) !== 0;
}

/** Tests if the specified node is flagged 'const'. */
export function isConst(node: Node): boolean {
  return (node.flags & NodeFlags.Const) !== 0;
}

/** Tests if a function fulfills the requirements to become a start function. */
export function isStartFunction(node: FunctionLikeDeclaration): boolean {
  return !!(
    node.name &&
    getTextOfNode(node.name) === "start" &&
    !node.typeParameters &&
    node.parameters.length === 0 &&
    node.type &&
    getTextOfNode(node.type) === "void"
  );
}

/** Gets the reflected type of an expression. */
export function getReflectedType(node: Expression): reflection.Type {
  return <reflection.Type>(<any>node).reflectedType || null;
}

/** Sets the reflected type of an expression. */
export function setReflectedType(node: Expression, type: reflection.Type): void {
  if (!type) throw Error("type cannot be null");
  (<any>node).reflectedType = type;
}

/** Gets the reflected function instance (describing a function with generic types resolved) of a function declaration. */
export function getReflectedFunction(node: FunctionLikeDeclaration): reflection.Function {
  return <reflection.Function>(<any>node).reflectedFunction || null;
}

/** Sets the reflected function instance (describing a function with generic types resolved) of a function declaration. */
export function setReflectedFunction(node: FunctionLikeDeclaration, instance: reflection.Function): void {
  if (!instance)
    throw Error("instance cannot be null");
  (<any>node).reflectedFunction = instance;
}

/** Gets the reflected function template (describing a function with unresolved generic types) of a function declaration. */
export function getReflectedFunctionTemplate(node: FunctionLikeDeclaration): reflection.FunctionTemplate {
  return <reflection.FunctionTemplate>(<any>node).reflectedFunctionTemplate || null;
}

/** Sets the reflected function template (describing a function with unresolved generic types) of a function declaration. */
export function setReflectedFunctionTemplate(node: FunctionLikeDeclaration, template: reflection.FunctionTemplate): void {
  if (!template)
    throw Error("template cannot be null");
  (<any>node).reflectedFunctionTemplate = template;
}

/** Gets the reflected class instance (describing a class with generic types resolved) of a class declaration. */
export function getReflectedClass(node: ClassDeclaration): reflection.Class {
  return <reflection.Class>(<any>node).reflectedClass || null;
}

/** Sets the reflected class instance (describing a class with generic types resolved) of a class declaration. */
export function setReflectedClass(node: ClassDeclaration, instance: reflection.Class): void {
  if (!instance)
    throw Error("instance cannot be null");
  (<any>node).reflectedClass = instance;
}

/** Gets the reflected class template (describing a class with unresolved generic types) of a class declaration. */
export function getReflectedClassTemplate(node: ClassDeclaration): reflection.ClassTemplate {
  return <reflection.ClassTemplate>(<any>node).reflectedClass || null;
}

/** Sets the reflected class template (describing a class with unresolved generic types) of a class declaration. */
export function setReflectedClassTemplate(node: ClassDeclaration, template: reflection.ClassTemplate): void {
  if (!template)
    throw Error("template cannot be null");
  (<any>node).reflectedClassTemplate = template;
}

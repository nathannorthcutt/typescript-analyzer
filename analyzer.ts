import fs from "fs";
import process, { exit } from "process";
import { inspect } from "util";
import {
  isAliasTypeArgument,
  isConditionalType,
  isEmptyObject,
  isEvolvingArray,
  isIntersectionType,
  isIntrinsicType,
  isKeyType,
  isOpaqueType,
  isPropertyAccess,
  isStringLiteral,
  isSubstitution,
  isTemplateLiteral,
  isTypeDefinition,
  isTypeInformation,
  isTypeInstantiation,
  isTypeParameter,
  isUnionType,
  isUniqueSymbol,
  isUnstructuredType,
  type TypeInformationSchema,
} from "./type-entries.js";

/**
 * Filter any node modules dependencies
 */
const FILTER_NODE_MODULES = /.*node_modules.*/;

/**
 * Filter test files and test utilities
 */
const FILTER_TEST_FILES = /.*(test\.ts|test.utils\.ts|integration\.ts)$/;

/**
 * Filter type references
 */
const FILTER_REFERENCES = /.*.d.ts$/;

/**
 * Filter functions from display names
 */
const FILTER_FUNCTIONS = /.*=>.*/;

/**
 * Ignore config files
 */
const IGNORE_CONFIG_FILES = /.*config\.ts$/;

/**
 * Get the type arguments
 */
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: node analyzer.js {path_to_trace_directory}");
  exit(1);
}

if (!fs.existsSync(args[0])) {
  console.error(`Path does not exist: ${args[0]}`);
  exit(1);
}

const fd = fs.openSync(args[0], "r");
if (!fs.fstatSync(fd).isDirectory()) {
  console.error(`Path is not a directory: ${args[0]}`);
  exit(1);
}

function isFiltered(info: TypeInformationSchema): boolean {
  const path = info.firstDeclaration?.path ?? info.referenceLocation?.path;
  return (
    (path !== undefined &&
      (FILTER_NODE_MODULES.test(path) ||
        FILTER_TEST_FILES.test(path) ||
        IGNORE_CONFIG_FILES.test(path) ||
        FILTER_REFERENCES.test(path))) ||
    (info.display !== undefined && FILTER_FUNCTIONS.test(info.display)) ||
    info.symbolName === "globalThis" ||
    info.flags
      .filter((f) => f !== "StringLiteral" && f !== "TemplateLiteral")
      .find((f) => f.endsWith("Literal")) !== undefined
  );
}

let n = 0;

for (const file of fs.readdirSync(args[0], "utf-8")) {
  if (file.startsWith("types.")) {
    const stats = {
      files: 1,
      total: 0,
      stringLiterals: 0,
      types: 0,
      typeAlias: 0,
      unions: 0,
      intersections: 0,
      substitions: 0,
      instantiations: 0,
      conditionals: 0,
      intrinsics: 0,
      templateLiterals: 0,
      emptyObjects: 0,
      typeParameters: 0,
      keyTypes: 0,
      propertiesAccessed: 0,
      opaque: 0,
      uniqueSymbols: 0,
      evolvingArrays: 0,
      unstructured: 0,
      unknown: 0,
    };
    const contents = (
      await import(`${args[0]}/${file}`, {
        with: { type: "json" },
      })
    ).default as object[];

    for (const entry of contents) {
      if (isTypeInformation(entry)) {
        stats.total++;

        if (!isFiltered(entry)) {
          // Process the information
          if (isUnstructuredType(entry)) {
            stats.unstructured++;
          } else if (isAliasTypeArgument(entry)) {
            stats.typeAlias++;
          } else if (isTypeInstantiation(entry)) {
            stats.instantiations++;
          } else if (isStringLiteral(entry)) {
            stats.stringLiterals++;
          } else if (isUnionType(entry)) {
            stats.unions++;
          } else if (isIntersectionType(entry)) {
            stats.intersections++;
          } else if (isSubstitution(entry)) {
            stats.substitions++;
          } else if (isTypeDefinition(entry)) {
            stats.types++;
          } else if (isConditionalType(entry)) {
            stats.conditionals++;
          } else if (isIntrinsicType(entry)) {
            stats.intrinsics++;
          } else if (isTemplateLiteral(entry)) {
            stats.templateLiterals++;
          } else if (isEmptyObject(entry)) {
            stats.emptyObjects++;
          } else if (isTypeParameter(entry)) {
            stats.typeParameters++;
          } else if (isKeyType(entry)) {
            stats.keyTypes++;
          } else if (isPropertyAccess(entry)) {
            stats.propertiesAccessed++;
          } else if (isOpaqueType(entry)) {
            stats.opaque++;
          } else if (isEvolvingArray(entry)) {
            stats.evolvingArrays++;
          } else if (isUniqueSymbol(entry)) {
            stats.uniqueSymbols++;
          } else {
            stats.unknown++;
            if (n++ < 5) {
              console.log(inspect(entry, true, 10, true));
            }
          }
        }
      }
    }

    console.log(`${file}:\n\n${inspect(stats, true, 10, false)}\n`);
  }
}

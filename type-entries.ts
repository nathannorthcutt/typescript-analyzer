export type Flags =
  | "Any"
  | "Unknown"
  | "String"
  | "Number"
  | "Boolean"
  | "Enum"
  | "BigInt"
  | "StringLiteral"
  | "NumberLiteral"
  | "BooleanLiteral"
  | "EnumLiteral"
  | "BigIntLiteral"
  | "ESSymbol"
  | "UniqueESSymbol"
  | "Void"
  | "Undefined"
  | "Null"
  | "Never"
  | "TypeParameter"
  | "Object"
  | "Union" // T | U
  | "Intersection" // T & U
  | "Index" // keyof T
  | "IndexedAccess" // T[K]
  | "Conditional" // T extends U ? X : Y
  | "Substitution" // Type parameter substitution
  | "NonPrimitive" // Intrinsic type
  | "TemplateLiteral"
  | "StringMapping" // Uppercase/Lowercase
  | "Reserved1"
  | "Reserved2"
  | "AnyOrUnknown"
  | "Nullable"
  | "Literal"
  | "Unit"
  | "Freshable"
  | "StringOrNumberLiteral"
  | "StringOrNumberLiteralOrUnique"
  | "DefinitelyFalsy"
  | "PossiblyFalsy"
  | "Intrinsic"
  | "StringLike"
  | "NumberLike"
  | "BigIntLike"
  | "BooleanLike"
  | "EnumLike"
  | "ESSymbolLike"
  | "VoidLike"
  | "Primitive"
  | "DefinitelyNonNullable"
  | "DisjointDomains"
  | "UnionOrIntersection"
  | "StructuredType"
  | "TypeVariable"
  | "InstantiableNonPrimitive"
  | "InstantiablePrimitive"
  | "Instantiable"
  | "StructuredOrInstantiable"
  | "ObjectFlagsType"
  | "Simplifiable"
  | "Singleton"
  | "Narrowable"
  | "IncludesMask"
  | "IncludesMissingType"
  | "IncludesNonWideningType"
  | "IncludesWildcard"
  | "IncludesEmptyObject"
  | "IncludesInstantiable"
  | "IncludesConstrainedTypeVariable"
  | "IncludesError"
  | "NonPrimitiveUnion";

export type TypeInformationSchema = {
  id: number;
  flags: Flags[];
  recursionId: number;
  intrinsicName?: string;
  display?: string;
  unionTypes?: number[];
  symbolName?: string;
  firstDeclaration?: { path: string };
  instantiatedType?: number;
  typeArguments?: number[];
  keyofType?: number;
  indexedAccessObjectType?: number;
  indexedAccessIndexType?: number;
  intersectionTypes?: number[];
  aliasTypeArguments?: number[];
  conditionalCheckType?: number;
  conditionalExtendsType?: number;
  conditionalTrueType?: number;
  conditionalFalseType?: number;
  isTuple?: boolean;
  substitutionBaseType?: number;
  constraintType?: number;
  referenceLocation?: { path: string };
  evolvingArrayElementType?: number;
  evolvingArrayFinalType?: number;
  reverseMappedSourceType?: number;
  reverseMappedMappedType?: number;
  reverseMappedConstraintType?: number;
  destructuringPattern?: { path: string };
};

export function isTypeInformation(obj: unknown): obj is TypeInformationSchema {
  return (
    obj !== null &&
    typeof obj === "object" &&
    "id" in obj &&
    "flags" in obj &&
    obj.flags !== null &&
    Array.isArray(obj.flags)
  );
}

type SetFlags<F extends Flags> = Omit<TypeInformationSchema, "flags"> & {
  flags: [F];
};

type MakeRequired<
  K extends keyof TypeInformationSchema,
  F extends Flags
> = Required<Pick<TypeInformationSchema, K>> &
  Omit<TypeInformationSchema, K | "flags"> & { flags: [F] };

export type UnionType = MakeRequired<"unionTypes" | "recursionId", "Union">;
export type TypeDefinition = MakeRequired<
  "firstDeclaration" | "symbolName",
  "Object"
>;
export type StringLiteral = MakeRequired<
  "display" | "recursionId",
  "StringLiteral"
>;
export type TypeInstantiation = MakeRequired<
  "typeArguments" | "instantiatedType",
  "Object"
>;
export type ConditionalType = MakeRequired<
  | "conditionalCheckType"
  | "conditionalTrueType"
  | "conditionalFalseType"
  | "conditionalExtendsType",
  "Conditional"
>;
export type IntrinsicType = MakeRequired<"intrinsicName", "Intrinsic">;
export type TemplateLiteralType = SetFlags<"TemplateLiteral">;
export type EmptyObjectType = MakeRequired<"display", "Object">;
export type TypeParameter = SetFlags<"TypeParameter">;
export type KeyType = MakeRequired<"keyofType", "Index">;
export type PropertyAccess = MakeRequired<
  "indexedAccessObjectType" | "indexedAccessIndexType",
  "IndexedAccess"
>;
export type IntersectionType = MakeRequired<
  "intersectionTypes",
  "Intersection"
>;
export type SubstitionType = MakeRequired<
  "substitutionBaseType" | "constraintType",
  "Substitution"
>;
export type OpaqueType = MakeRequired<"display", "Object">;
export type EvolvingArray = MakeRequired<
  "evolvingArrayElementType" | "evolvingArrayFinalType",
  "Object"
>;
export type UniqueESSymbol = MakeRequired<"symbolName", "UniqueESSymbol">;
export type AliasTypeArgument = MakeRequired<"aliasTypeArguments", "Object">;
export type UnstructuredType = MakeRequired<"symbolName", "Object">;

export function isUnstructuredType(
  obj: TypeInformationSchema
): obj is UnstructuredType {
  return obj.flags.indexOf("Object") >= 0 && obj.symbolName === "__type";
}

export function isAliasTypeArgument(
  obj: TypeInformationSchema
): obj is AliasTypeArgument {
  return obj.flags.indexOf("Object") >= 0 && "aliasTypeArguments" in obj;
}

export function isUniqueSymbol(
  obj: TypeInformationSchema
): obj is UniqueESSymbol {
  return obj.flags.indexOf("UniqueESSymbol") >= 0;
}

export function isEvolvingArray(
  obj: TypeInformationSchema
): obj is EvolvingArray {
  return (
    obj.flags.indexOf("Object") >= 0 &&
    "evolvingArrayElementType" in obj &&
    "evolvingArrayFinalType" in obj
  );
}

export function isOpaqueType(obj: TypeInformationSchema): obj is OpaqueType {
  return obj.flags.indexOf("Object") >= 0 && "display" in obj;
}

export function isSubstitution(
  obj: TypeInformationSchema
): obj is SubstitionType {
  return obj.flags.indexOf("Substitution") >= 0;
}

export function isIntersectionType(
  obj: TypeInformationSchema
): obj is IntersectionType {
  return obj.flags.indexOf("Intersection") >= 0;
}

export function isPropertyAccess(
  obj: TypeInformationSchema
): obj is PropertyAccess {
  return obj.flags.indexOf("IndexedAccess") >= 0;
}

export function isKeyType(obj: TypeInformationSchema): obj is KeyType {
  return obj.flags.indexOf("Index") >= 0;
}

export function isTypeParameter(
  obj: TypeInformationSchema
): obj is TypeParameter {
  return obj.flags.indexOf("TypeParameter") >= 0;
}

export function isEmptyObject(
  obj: TypeInformationSchema
): obj is EmptyObjectType {
  return (
    obj.flags.indexOf("Object") >= 0 && "display" in obj && obj.display === "{}"
  );
}

export function isTemplateLiteral(
  obj: TypeInformationSchema
): obj is TemplateLiteralType {
  return obj.flags.indexOf("TemplateLiteral") >= 0;
}

export function isIntrinsicType(
  obj: TypeInformationSchema
): obj is IntrinsicType {
  return "intrinsicName" in obj;
}

export function isConditionalType(
  obj: TypeInformationSchema
): obj is ConditionalType {
  return obj.flags.indexOf("Conditional") >= 0 && "conditionalCheckType" in obj;
}

export function isUnionType(obj: TypeInformationSchema): obj is UnionType {
  return obj.flags.indexOf("Union") >= 0;
}

export function isTypeDefinition(
  obj: TypeInformationSchema
): obj is TypeDefinition {
  return (
    obj.flags.indexOf("Object") >= 0 &&
    "symbolName" in obj &&
    "firstDeclaration" in obj
  );
}

export function isStringLiteral(
  obj: TypeInformationSchema
): obj is StringLiteral {
  return obj.flags.indexOf("StringLiteral") >= 0;
}

export function isTypeInstantiation(
  obj: TypeInformationSchema
): obj is TypeInstantiation {
  return obj.flags.indexOf("Object") >= 0 && "instantiatedType" in obj;
}

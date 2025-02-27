
let oConfigReferenceTemplate = {
  "complexity": "default",
  "ratings": "default",
  "naming": "default",
  "score":"default",
};

let aDownloadConfig = [
  {
   "Name":"Actions",
    "headers": {
     "Name":"Name",
      "step": "Step",
      "Type": "Type",
      "id": "MetaID",
      "hasId": "HashId",
      "tier":"Tier",
      "connector": "Connector",
      "imgURL":"Connector Img",
      "runAfter": "Run After",
      "exception": "Exception",
      "index": "Index",
      "Complexity": "Complexity",   
      "detail": "Detail",
      "filter": "Filter",
      "pagination": "Pagination",
      "secure": "Secure Data",
      "retry": "Retry Policy",
      "timeout": "Timeout",
      "positionInfo":"Internal/Route",
      "position": "Previous",
      "notes":"Notes",
      "parent":"Parent",
      "positionIndex":"Previous ID",
      "positionType":"Previous Type",
      "nested": "Nests"
    },
  },
  {
   "Name":"Variables",
    "headers": {
     "Name":"Name",
      "Type": "Type",
      "value": "Value",
      "used": "Used",
      "named": "Named",   
      "local": "Local",   
    },
  },
  {
   "Name":"Connections",
    "headers": {
      "conName": "Name",
      "appId": "AppId",
      "opId": "OpId",
      "count": "Count"
      
    },
  },
];

let oRatingsTemplate = {
  "complexityAm": 50,
  "complexityRe": 100,
  "actionsAm": 30,
  "actionsRe": 50,
  "variablesAm": 3,
  "variablesRe": 5,
  "exceptionsAm": 1,
  "exceptionsRe": 0,
};

let aScoringTemplate = [
  {
   "Name":"exceptionScope",
   "Score":10,
   "Note":"score added for exception scope",
  },
  {
   "Name":"mainScope",
   "Score":10,
   "Note":"score added for main scope",
  },
  {
   "Name":"varNaming",
   "Score":10,
   "Note":"score added for following variable naming convention (see aRatingsTemplate)",
  },
  {
   "Name":"varUsed",
   "Score":5,
   "Note":"score added for if all variables used",
  },
  {
   "Name":"varConstant",
   "Score":5,
   "Note":"score added for naming variables with value in all capitals",
  },
  {
   "Name":"variables",
   "Score":10,
   "Note":"score given for variables before deductions",
  },
  {
   "Name":"variablesMin",
   "Score":0,
   "Note":"minimum allowed variables before deductions",
  },
  {
   "Name":"variablesDeduction",
   "Score":1,
   "Note":"score added for exception scope",
  },
  {
   "Name":"composes",
   "Score":10,
   "Note":"score given for composes before deductions",
  },
  {
   "Name":"composesMin",
   "Score":0,
   "Note":"minimum allowed composes before deductions",
  },
  {
   "Name":"composesDeduction",
   "Score":5,
   "Note":"score deducted for every scope used",
  },
  {
   "Name":"connections",
   "Score":10,
   "Note":"score given for connections before deductions",
  },
  {
   "Name":"connectionsMin",
   "Score":3,
   "Note":"minimum allowed connections before deductions",
  },
  {
   "Name":"connectionsDeduction",
   "Score":2,
   "Note":"score deducted for every connections used",
  },

  {
   "Name":"complexityRed",
   "Score":0,
   "Note":"score added for red scoring complexity",
  },
  {
   "Name":"complexityAmber",
   "Score":15,
   "Note":"score added for amber scoring complexity",
  },
  {
   "Name":"complexityGreen",
   "Score":20,
   "Note":"score added green scoring complexity",
  },

  {
   "Name":"actionsRed",
   "Score":0,
   "Note":"score added for red scoring actions",
  },
  {
   "Name":"actionsAmber",
   "Score":5,
   "Note":"score added for amber scoring actions",
  },
  {
   "Name":"actionsGreen",
   "Score":10,
   "Note":"score added green scoring actions"
  },
];

let oNamingTemplate = {
  "char": 1,
  "data": [
    { "Type": "boolean", "Letter": "b" },
    { "Type": "string", "Letter": "s" },
    { "Type": "integer", "Letter": "i" },
    { "Type": "float", "Letter": "f" },
    { "Type": "object", "Letter": "o" },
    { "Type": "array", "Letter": "a" }
  ]
};

let aComplexityTemplate = [
  {
   "Name":"GetItemsshared_sharepointonline",
    "Complexity": 1,
  },
  {
   "Name":"CopyFileAsyncshared_sharepointonline",
    "Complexity": 1,
  },
  {
   "Name":"GetFileContentshared_sharepointonline",
    "Complexity": 1,
  },
  {
   "Name":"GetFileContentByPathshared_sharepointonline",
    "Complexity": 1,
  },
  {
   "Name":"HttpRequestshared_sharepointonline",
    "Complexity": 5,
  },
  {
   "Name":"DeleteFileshared_sharepointonline",
    "Complexity": 1,
  },
  {
   "Name":"ConvertFileshared_onedriveforbusiness",
    "Complexity": 2,
  },
  {
   "Name":"ConvertFileByPathshared_onedriveforbusiness",
    "Complexity": 1,
  },
  {
   "Name":"CopyDriveFileshared_onedriveforbusiness",
    "Complexity": 1,
  },
  {
   "Name":"CopyDriveFileByPathshared_onedriveforbusiness",
    "Complexity": 1,
  },
  {
   "Name":"ListFolderV2shared_onedriveforbusiness",
    "Complexity": 1,
  },
  {
   "Name":"ListRootFoldershared_onedriveforbusiness",
    "Complexity": 1,
  },
  {
   "Name":"DeleteFileshared_onedriveforbusiness",
    "Complexity": 1,
  },
  {
   "Name":"GetItemsshared_excelonlinebusiness",
    "Complexity": 1,
  },
  {
   "Name":"PatchItemshared_excelonlinebusiness",
    "Complexity": 1,
  },
  {
   "Name":"RunScriptProdshared_excelonlinebusiness",
    "Complexity": 5,
  },
  {
   "Name":"ListGroupMembersshared_office365groups",
    "Complexity": 1,
  },
  {
   "Name":"SharedMailboxSendEmailV2shared_office365",
    "Complexity": 1,
  },
  {
   "Name":"StartAndWaitForAnApprovalshared_approvals",
    "Complexity": 2,
  },
  {
   "Name":"ApiConnection",
    "Complexity": 2,
  },
  {
   "Name":"ApiConnectionWebhook",
    "Complexity": 2,
  },
  {
   "Name":"ApiManagement",
    "Complexity": 2,
  },
  {
   "Name":"AppendToArrayVariable",
    "Complexity": 2,
  },
  {
   "Name":"AppendToStringVariable",
    "Complexity": 2,
  },
  {
   "Name":"Batch",
    "Complexity": 5,
  },
  {
   "Name":"Compose",
    "Complexity": 2,
  },
  {
   "Name":"DecrementVariable",
    "Complexity": 2,
  },
  {
   "Name":"Expression",
    "Complexity": 2,
  },
  {
   "Name":"FlatFileDecoding",
    "Complexity": 5,
  },
  {
   "Name":"FlatFileEncoding",
    "Complexity": 5,
  },
  {
   "Name":"Foreach",
    "Complexity": 4,
  },
  {
   "Name":"Function",
    "Complexity": 5,
  },
  {
   "Name":"Http",
    "Complexity": 5,
  },
  {
   "Name":"HttpWebhook",
    "Complexity": 5,
  },
  {
   "Name":"If",
    "Complexity": 3,
  },
  {
   "Name":"IncrementVariable",
    "Complexity": 2,
  },
  {
   "Name":"InitializeVariable",
    "Complexity": 1,
  },
  {
   "Name":"IntegrationAccountArtifactLookup",
    "Complexity": 5,
  },
  {
   "Name":"Join",
    "Complexity": 3,
  },
  {
   "Name":"Liquid",
    "Complexity": 5,
  },
  {
   "Name":"ParseJson",
    "Complexity": 3,
  },
  {
   "Name":"Query",
    "Complexity": 3,
  },
  {
   "Name":"Recurrence",
    "Complexity": 5,
  },
  {
   "Name":"Request",
    "Complexity": 1,
  },
  {
   "Name":"Response",
    "Complexity": 1,
  },
  {
   "Name":"Scope",
    "Complexity": -1,
  },
  {
   "Name":"Select",
    "Complexity": 3,
  },
  {
   "Name":"SendToBatch",
    "Complexity": 5,
  },
  {
   "Name":"SetVariable",
    "Complexity": 2,
  },
  {
   "Name":"SlidingWindow",
    "Complexity": 5,
  },
  {
   "Name":"Switch",
    "Complexity": 4,
  },
  {
   "Name":"Table",
    "Complexity": 2,
  },
  {
   "Name":"Terminate",
    "Complexity": -1,
  },
  {
   "Name":"Until",
    "Complexity": 4,
  },
  {
   "Name":"Wait",
    "Complexity": 1,
  },
  {
   "Name":"Workflow",
    "Complexity": 5,
  },
  {
   "Name":"XmlValidation",
    "Complexity": 3,
  },
  {
   "Name":"Xslt",
    "Complexity": 3,
  },
  {
   "Name":"OpenApiConnection",
    "Complexity": 1,
  },
  {
   "Name":"Ai connection",
    "Complexity": 5,
  },
  {
   "Name":"loop till",
    "Complexity": 4,
  },
  {
   "Name":"OpenApiConnectionWebhook",
    "Complexity": 2,
  },
  {
   "Name":"Do_until",
    "Complexity": 4,
  },
];

@description('Name of the Azure Static Web App')
param staticWebAppName string

@description('Name of the Azure Function App')
param functionAppName string

@description('Name of the Azure OpenAI Service')
param openAIServiceName string

@description('Location for all resources')
param location string = resourceGroup().location

@description('SKU for the Azure Static Web App')
param staticWebAppSku string = 'Free'

@description('SKU for the Azure Function App')
param functionAppSku string = 'Consumption'

@description('SKU for the Azure OpenAI Service')
param openAISku string = 'Standard'

resource staticWebApp 'Microsoft.Web/staticSites@2021-01-01' = {
  name: staticWebAppName
  location: location
  sku: {
    name: staticWebAppSku
  }
  properties: {
    repositoryUrl: 'https://github.com/rukasakurai/mcp-device-settings-demo'
    branch: 'main'
  }
}

resource functionApp 'Microsoft.Web/sites@2021-01-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp'
  properties: {
    serverFarmId: functionAppHostingPlan.id
  }
}

resource functionAppHostingPlan 'Microsoft.Web/serverfarms@2021-01-01' = {
  name: '${functionAppName}-plan'
  location: location
  sku: {
    name: functionAppSku
  }
}

resource openAIService 'Microsoft.CognitiveServices/accounts@2021-01-01' = {
  name: openAIServiceName
  location: location
  kind: 'OpenAI'
  sku: {
    name: openAISku
  }
  properties: {
    apiProperties: {
      enableOpenAI: true
    }
  }
}

resource staticWebAppIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2021-01-01' = {
  name: '${staticWebAppName}-identity'
  location: location
}

resource functionAppIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2021-01-01' = {
  name: '${functionAppName}-identity'
  location: location
}

resource roleAssignment 'Microsoft.Authorization/roleAssignments@2021-01-01' = {
  name: guid(staticWebApp.id, functionApp.id, openAIService.id)
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'Contributor')
    principalId: staticWebAppIdentity.properties.principalId
    principalType: 'ServicePrincipal'
    scope: resourceGroup().id
  }
}

output staticWebAppUrl string = staticWebApp.properties.defaultHostname
output functionAppUrl string = functionApp.properties.defaultHostname
output openAIServiceEndpoint string = openAIService.properties.endpoint

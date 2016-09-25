Imports Microsoft.VisualBasic
Imports TJX.AJHB.AppData.Contracts
Namespace VB.Rest.EnvironmentalInfoService

    <ServiceContract()>
      Public Interface IEnvironmentalInfoService

        <OperationContract()>
       <WebGet(responseformat:=WebMessageFormat.Json, UriTemplate:="environmental/{name}")>
        Function GetEnvironmentalInfo(ByVal name As String) As TJX.AJHB.AppData.Contracts.Environmental.EnvironmentalContract

    End Interface
End Namespace
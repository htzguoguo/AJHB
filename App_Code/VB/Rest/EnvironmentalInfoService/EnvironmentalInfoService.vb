Imports System.ServiceModel.Activation
Imports Microsoft.VisualBasic
Imports TJX.AJHB.AppData.Contracts
Imports TJX.AJHB.MDA.Service
Imports System.ServiceModel
Imports TTSK.Web.AuthorityEntry

Namespace VB.Rest.EnvironmentalInfoService

    <AspNetCompatibilityRequirements(requirementsmode:=Activation.AspNetCompatibilityRequirementsMode.Allowed)>
     Public Class EnvironmentalInfoService
        Implements IEnvironmentalInfoService
        
        Public Function GetEnvironmentalInfo(name As String) As TJX.AJHB.AppData.Contracts.Environmental.EnvironmentalContract Implements IEnvironmentalInfoService.GetEnvironmentalInfo
            Dim result As New TJX.AJHB.AppData.Contracts.Environmental.EnvironmentalContract
            If Not String.IsNullOrEmpty(name) Then
                Dim enterprise = EnterpriseInfo.EnterpriseService.GetEnvironmentalByName(name)
                Return New TJX.AJHB.AppData.Contracts.Environmental.EnvironmentalContract(enterprise)
            End If
            Return result
        End Function

    End Class

End Namespace
import React, { useState, useEffect, useRef } from 'react';
import DiscodataSqlBuilder from '@eeacms/volto-datablocks/DiscodataSqlBuilder/View';
import Flags from '~/components/manage/Blocks/Flags/View';

const QueryBuilder = (props) => {
  return (
    <div>
      <Flags />
      {/**
        HEADER
        DB: Browse5_Header, site_flags
      */}
      <DiscodataSqlBuilder
        data={{
          '@type': 'discodata_sql_builder',
          sql: {
            value:
              '{"fieldsets":[{"id":"sql_metadata","title":"SQL","fields":["site_header","reporting_years"]}],"properties":{"site_header":{"title":"Site header","hasPagination":true,"urlQuery":false,"sql":"SELECT *\\nFROM [IED].[latest].[Browse5_Header] as B5H\\nLEFT JOIN [IED].[latest].[site_flags] as SF\\nON B5H.[siteInspireId] = SF.[Site Inspire ID]","packageName":"siteInspireId"},"reporting_years":{"title":"Reporting years","isCollection":true,"hasPagination":true,"urlQuery":false,"sql":"SELECT reportingYear\\nFROM [IED].[latest].[ReportData]\\nGROUP BY reportingYear"}}}',
          },
          where: {
            value:
              '{"fieldsets":[{"id":"where_statements_metadata","title":"Where statements","fields":["w1"]}],"properties":{"w1":{"title":"W1","sqlId":"site_header","urlQuery":false,"key":"B5H.siteInspireId","queryParam":"siteInspireId", "collation":"latin_ci_ai"}}}',
          },
          groupBy: {
            value:
              '{"fieldsets":[{"id":"group_by_statements_metadata","title":"Group by statements","fields":["g1"]}],"properties":{"g1":{"title":"G1","sqlId":"site_header","discodataKey":"euregReportingYear","key":"euregReportingYears"}}}',
          },
        }}
      />
      {/**
        SITE DETAILS (POLLUTANTS)
        DB: Browse6Header
      */}
      <DiscodataSqlBuilder
        data={{
          '@type': 'discodata_sql_builder',
          groupBy: {
            value:
              '{"fieldsets":[{"id":"group_by_statements_metadata","title":"Group by statements","fields":["g1","g2"]}],"properties":{"g1":{"title":"G1","sqlId":"site_details_1","discodataKey":"euregReportingYear","key":"euregReportingYears"},"g2":{"title":"G2","sqlId":"site_details_1","discodataKey":"facilityInspireId","key":"facilities"}}}',
          },
          sql: {
            value:
              '{"fieldsets":[{"id":"sql_metadata","title":"SQL","fields":["site_details_1"]}],"properties":{"site_details_1":{"title":"Site details 1","hasPagination":true,"urlQuery":false,"sql":"SELECT *\\nFROM [IED].[latest].[Browse6Header] as B6H\\nLEFT JOIN [IED].[latest].[facility_flags] FF\\nON \\n    B6H.[facilityInspireId] = FF.[Facility Inspire Id]\\n    AND B6H.[siteInspireId] = FF.[Site Inspire ID]","packageName":"siteInspireId"}},"required":[]}',
          },
          where: {
            value:
              '{"fieldsets":[{"id":"where_statements_metadata","title":"Where statements","fields":["w1"]}],"properties":{"w1":{"title":"W1","sqlId":"site_details_1","urlQuery":false,"key":"siteInspireId","queryParam":"siteInspireId", "collation":"latin_ci_ai"}},"required":[]}',
          },
        }}
      />
      {/**
        FACILITY DETAILS (POLLUTANTS)
        DB: Browse7Header
      */}
      <DiscodataSqlBuilder
        data={{
          '@type': 'discodata_sql_builder',
          groupBy: {
            value:
              '{"fieldsets":[{"id":"group_by_statements_metadata","title":"Group by statements","fields":["g1","g2"]}],"properties":{"g1":{"title":"G1","sqlId":"site_details_2","discodataKey":"euregReportingYear","key":"euregReportingYears"},"g2":{"title":"G2","sqlId":"site_details_2","discodataKey":"facilityInspireId","key":"facilities"}}}',
          },
          sql: {
            value:
              '{"fieldsets":[{"id":"sql_metadata","title":"SQL","fields":["site_details_2"]}],"properties":{"site_details_2":{"title":"Site details 2","hasPagination":true,"urlQuery":false,"sql":"SELECT *\\nFROM [IED].[latest].[Browse7Header]","packageName":"siteInspireId"}},"required":[]}',
          },
          where: {
            value:
              '{"fieldsets":[{"id":"where_statements_metadata","title":"Where statements","fields":["w1"]}],"properties":{"w1":{"title":"W1","sqlId":"site_details_2","urlQuery":false,"key":"siteInspireId","queryParam":"siteInspireId", "collation":"latin_ci_ai"}},"required":[]}',
          },
        }}
      />
      {/**
        SITE DETAILS 3
        DB: Browse8Header
      */}
      <DiscodataSqlBuilder
        data={{
          '@type': 'discodata_sql_builder',
          sql: {
            value:
              '{"fieldsets":[{"id":"sql_metadata","title":"SQL","fields":["site_details_3"]}],"properties":{"site_details_3":{"title":"site_details_3","hasPagination":true,"urlQuery":false,"sql":"SELECT\\n    siteInspireId,\\n    facilityInspireId,\\n    installationInspireId,\\n    euregReportingYear,\\n    regulatedActivities,\\n    entityStatus,\\n    seveso\\nFROM [IED].[latest].[Browse8Header]\\nWHERE :where\\nGROUP BY\\n    siteInspireId,\\n    facilityInspireId,\\n    installationInspireId,\\n    euregReportingYear,\\n    regulatedActivities,\\n    entityStatus,\\n    seveso","packageName":"siteInspireId"}},"required":[]}',
          },
          where: {
            value:
              '{"fieldsets":[{"id":"where_statements_metadata","title":"Where statements","fields":["w1"]}],"properties":{"w1":{"title":"W1","sqlId":"site_details_3","urlQuery":false,"key":"siteInspireId","queryParam":"siteInspireId", "collation":"latin_ci_ai"}}}',
          },
          groupBy: {
            value:
              '{"fieldsets":[{"id":"group_by_statements_metadata","title":"Group by statements","fields":["g1"]}],"properties":{"g1":{"title":"G1","sqlId":"site_details_3","discodataKey":"euregReportingYear","key":"euregReportingYears"}}}',
          },
        }}
      />
      {/**
        Permits
        DB: Browse9Header_Permit
      */}
      <DiscodataSqlBuilder
        data={{
          '@type': 'discodata_sql_builder',
          sql: {
            value:
              '{"fieldsets":[{"id":"sql_metadata","title":"SQL","fields":["permits"]}],"properties":{"permits":{"title":"permits","hasPagination":true,"urlQuery":false,"sql":"SELECT *\\nFROM [IED].[latest].[Browse9Header_Permit]","packageName":"siteInspireId"}},"required":[]}',
          },
          where: {
            value:
              '{"fieldsets":[{"id":"where_statements_metadata","title":"Where statements","fields":["w1"]}],"properties":{"w1":{"title":"W1","sqlId":"permits","urlQuery":false,"key":"siteInspireId","queryParam":"siteInspireId", "collation":"latin_ci_ai"}}}',
          },
          groupBy: {
            value:
              '{"fieldsets":[{"id":"group_by_statements_metadata","title":"Group by statements","fields":["g1"]}],"properties":{"g1":{"title":"G1","sqlId":"permits","discodataKey":"EUregReportingYear","key":"euregReportingYears"}}}',
          },
        }}
      />
      {/**
        BAT Conclusions
        DB: Browse9Header_BATConclusion
      */}
      <DiscodataSqlBuilder
        data={{
          '@type': 'discodata_sql_builder',
          sql: {
            value:
              '{"fieldsets":[{"id":"sql_metadata","title":"SQL","fields":["bat_conclusions"]}],"properties":{"bat_conclusions":{"title":"bat_conclusions","hasPagination":true,"urlQuery":false,"sql":"SELECT *\\nFROM [IED].[latest].[Browse9Header_BATConclusion]","packageName":"siteInspireId"}},"required":[]}',
          },
          where: {
            value:
              '{"fieldsets":[{"id":"where_statements_metadata","title":"Where statements","fields":["w1"]}],"properties":{"w1":{"title":"W1","sqlId":"bat_conclusions","urlQuery":false,"key":"siteInspireId","queryParam":"siteInspireId", "collation":"latin_ci_ai"}}}',
          },
          groupBy: {
            value:
              '{"fieldsets":[{"id":"group_by_statements_metadata","title":"Group by statements","fields":["g1"]}],"properties":{"g1":{"title":"G1","sqlId":"bat_conclusions","discodataKey":"EUregReportingYear","key":"euregReportingYears"}}}',
          },
        }}
      />
      {/**
        BAT Derogations
        DB: Browse9Header_BATDerogation
      */}
      <DiscodataSqlBuilder
        data={{
          '@type': 'discodata_sql_builder',
          sql: {
            value:
              '{"fieldsets":[{"id":"sql_metadata","title":"SQL","fields":["bat_derogations"]}],"properties":{"bat_derogations":{"title":"bat_derogations","hasPagination":true,"urlQuery":false,"sql":"SELECT *\\nFROM [IED].[latest].[Browse9Header_BATDerogation]","packageName":"siteInspireId"}},"required":[]}',
          },
          where: {
            value:
              '{"fieldsets":[{"id":"where_statements_metadata","title":"Where statements","fields":["w1"]}],"properties":{"w1":{"title":"W1","sqlId":"bat_derogations","urlQuery":false,"key":"siteInspireId","queryParam":"siteInspireId", "collation":"latin_ci_ai"}}}',
          },
          groupBy: {
            value:
              '{"fieldsets":[{"id":"group_by_statements_metadata","title":"Group by statements","fields":["g1"]}],"properties":{"g1":{"title":"G1","sqlId":"bat_derogations","discodataKey":"EUregReportingYear","key":"euregReportingYears"}}}',
          },
        }}
      />
      {/**
        LCP DETAILS
        DB: Browse10_Header
      */}
      <DiscodataSqlBuilder
        data={{
          '@type': 'discodata_sql_builder',
          sql: {
            value:
              '{"fieldsets":[{"id":"sql_metadata","title":"SQL","fields":["site_details_4"]}],"properties":{"site_details_4":{"title":"Site details 4","hasPagination":true,"urlQuery":false,"sql":"SELECT *\\nFROM [IED].[latest].[Browse10_Header]","packageName":"siteInspireId"}}}',
          },
          where: {
            value:
              '{"fieldsets":[{"id":"where_statements_metadata","title":"Where statements","fields":["w1"]}],"properties":{"w1":{"title":"W1","sqlId":"site_details_4","urlQuery":false,"key":"siteInspireId","queryParam":"siteInspireId", "collation":"latin_ci_ai"}}}',
          },
          groupBy: {
            value:
              '{"fieldsets":[{"id":"group_by_statements_metadata","title":"Group by statements","fields":["g1","g2"]}],"properties":{"g1":{"title":"G1","sqlId":"site_details_4","discodataKey":"lcpInspireId","key":"lcps"},"g2":{"title":"G2","sqlId":"site_details_4","discodataKey":"euregReportingYear","key":"euregReportingYears"}}}',
          },
        }}
      />
    </div>
  );
};

export default QueryBuilder;

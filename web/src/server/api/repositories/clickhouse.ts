import { parseJsonPrioritised, type JsonNested } from "@langfuse/shared";
import {
  clickhouseClient,
  convertTraces,
  observationRecordRead,
  scoreRecord,
} from "@langfuse/shared/src/server";
import { z } from "zod";

export const getObservation = async (
  observationId: string,
  projectId: string,
) => {
  const observation = await clickhouseClient.query({
    query: `SELECT * FROM observations FINAL where id = '${observationId}' and project_id = '${projectId}' LIMIT 1`,
    format: "JSONEachRow",
  });
  const jsonRecords = await observation.json();
  if (jsonRecords.length === 0) {
    return undefined;
  }
  return convertObservations(jsonRecords)[0];
};

export const getObservations = async (traceId: string, projectId: string) => {
  const observations = await clickhouseClient.query({
    query: `SELECT * FROM observations FINAL where trace_id = '${traceId}' and project_id = '${projectId}'`,
    format: "JSONEachRow",
  });
  const jsonRecords = await observations.json();

  return convertObservations(jsonRecords);
};

export const getTraces = async (traceId: string, projectId: string) => {
  const trace = await clickhouseClient.query({
    query: `SELECT * FROM traces FINAL where id = '${traceId}' and project_id = '${projectId}' LIMIT 1`,
    format: "JSONEachRow",
  });
  const traceJson = await trace.json();

  console.log("traceJson", traceJson);
  return convertTraces(traceJson);
};

export const getScores = async (traceId: string, projectId: string) => {
  const scores = await clickhouseClient.query({
    query: `SELECT * FROM scores FINAL where trace_id = '${traceId}' and project_id = '${projectId}'`,
    format: "JSONEachRow",
  });
  const jsonRecords = await scores.json();

  console.log("scores", jsonRecords);

  const parsedRecord = z.array(scoreRecord).parse(jsonRecords);

  return parsedRecord.map((record) => {
    return {
      ...record,
      projectId: record.project_id,
      observationId: record.observation_id,
      traceId: record.trace_id,
    };
  });
};

export const convertRecordToJsonSchema = (
  record: Record<string, string>,
): JsonNested | undefined => {
  const jsonSchema: JsonNested = {};

  // if record is empty, return undefined
  if (Object.keys(record).length === 0) {
    return undefined;
  }

  for (const key in record) {
    try {
      jsonSchema[key] = JSON.parse(record[key]);
    } catch (e) {
      jsonSchema[key] = record[key];
    }
  }

  return jsonSchema;
};

function convertObservations(jsonRecords: unknown[]) {
  const parsedRecord = z.array(observationRecordRead).parse(jsonRecords);

  const a = parsedRecord.map((record) => {
    return {
      id: record.id,
      traceId: record.trace_id,
      projectId: record.project_id,
      type: record.type,
      name: record.name,
      level: record.level,
      version: record.version,
      model: record.model,
      input: record.input ? parseJsonPrioritised(record.input) : undefined,
      output: record.output ? parseJsonPrioritised(record.output) : undefined,
      unit: record.unit,
      parentId: record.parent_observation_id,
      createdAt: record.created_at,
      startTime: record.start_time,
      endTime: record.end_time,
      statusMessage: record.status_message,
      internalModel: record.internal_model,
      modelParameters: record.model_parameters
        ? parseJsonPrioritised(record.model_parameters)
        : null,
      metadata: convertRecordToJsonSchema(record.metadata),
      inputUsage: record.input_usage,
      outputUsage: record.output_usage,
      totalUsage: record.total_usage,
      inputCost: record.input_cost,
      outputCost: record.output_cost,
      totalCost: record.total_cost,
      completionStartTime: record.completion_start_time,
      promptId: record.prompt_id,
    };
  });

  console.log("🚨🚨🚨🚨", JSON.stringify(a));
  return a;
}

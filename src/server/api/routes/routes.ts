/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TriggerController } from './../controllers/trigger.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PluginController } from './../controllers/plugin.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ConnectionController } from './../controllers/connection.controller';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "SupportedDbIdentifier": {
        "dataType": "refEnum",
        "enums": ["postgresql"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DatabasePluginConfig": {
        "dataType": "refObject",
        "properties": {
            "id": {"ref":"SupportedDbIdentifier","required":true},
            "name": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ConnectionConfig": {
        "dataType": "refObject",
        "properties": {
            "pluginId": {"ref":"SupportedDbIdentifier","required":true},
            "name": {"dataType":"string","required":true},
            "host": {"dataType":"string","required":true},
            "port": {"dataType":"double","required":true},
            "database": {"dataType":"string","required":true},
            "user": {"dataType":"string"},
            "password": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Connection": {
        "dataType": "refObject",
        "properties": {
            "connectionId": {"dataType":"string","required":true},
            "connectionConfig": {"ref":"ConnectionConfig","required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
            "isActive": {"dataType":"boolean","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ConnectionResult": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "message": {"dataType":"string","required":true},
            "connectionTime": {"dataType":"double"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"ignore","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsTriggerController_health: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/trigger/health',
            ...(fetchMiddlewares<RequestHandler>(TriggerController)),
            ...(fetchMiddlewares<RequestHandler>(TriggerController.prototype.health)),

            async function TriggerController_health(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTriggerController_health, request, response });

                const controller = new TriggerController();

              await templateService.apiHandler({
                methodName: 'health',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPluginController_getSupportedDbIds: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/plugins/ids',
            ...(fetchMiddlewares<RequestHandler>(PluginController)),
            ...(fetchMiddlewares<RequestHandler>(PluginController.prototype.getSupportedDbIds)),

            async function PluginController_getSupportedDbIds(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPluginController_getSupportedDbIds, request, response });

                const controller = new PluginController();

              await templateService.apiHandler({
                methodName: 'getSupportedDbIds',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPluginController_getSupportedDbConfigs: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/plugins/configs',
            ...(fetchMiddlewares<RequestHandler>(PluginController)),
            ...(fetchMiddlewares<RequestHandler>(PluginController.prototype.getSupportedDbConfigs)),

            async function PluginController_getSupportedDbConfigs(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPluginController_getSupportedDbConfigs, request, response });

                const controller = new PluginController();

              await templateService.apiHandler({
                methodName: 'getSupportedDbConfigs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPluginController_getSupportedDbConfig: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"ref":"SupportedDbIdentifier"},
        };
        app.get('/plugins/:id/config',
            ...(fetchMiddlewares<RequestHandler>(PluginController)),
            ...(fetchMiddlewares<RequestHandler>(PluginController.prototype.getSupportedDbConfig)),

            async function PluginController_getSupportedDbConfig(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPluginController_getSupportedDbConfig, request, response });

                const controller = new PluginController();

              await templateService.apiHandler({
                methodName: 'getSupportedDbConfig',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsConnectionController_getAllConnections: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/connections/all',
            ...(fetchMiddlewares<RequestHandler>(ConnectionController)),
            ...(fetchMiddlewares<RequestHandler>(ConnectionController.prototype.getAllConnections)),

            async function ConnectionController_getAllConnections(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsConnectionController_getAllConnections, request, response });

                const controller = new ConnectionController();

              await templateService.apiHandler({
                methodName: 'getAllConnections',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsConnectionController_createConnection: Record<string, TsoaRoute.ParameterSchema> = {
                config: {"in":"body","name":"config","required":true,"ref":"ConnectionConfig"},
        };
        app.post('/connections/create',
            ...(fetchMiddlewares<RequestHandler>(ConnectionController)),
            ...(fetchMiddlewares<RequestHandler>(ConnectionController.prototype.createConnection)),

            async function ConnectionController_createConnection(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsConnectionController_createConnection, request, response });

                const controller = new ConnectionController();

              await templateService.apiHandler({
                methodName: 'createConnection',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsConnectionController_testConnection: Record<string, TsoaRoute.ParameterSchema> = {
                config: {"in":"body","name":"config","required":true,"ref":"ConnectionConfig"},
        };
        app.post('/connections/test',
            ...(fetchMiddlewares<RequestHandler>(ConnectionController)),
            ...(fetchMiddlewares<RequestHandler>(ConnectionController.prototype.testConnection)),

            async function ConnectionController_testConnection(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsConnectionController_testConnection, request, response });

                const controller = new ConnectionController();

              await templateService.apiHandler({
                methodName: 'testConnection',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsConnectionController_closeConnection: Record<string, TsoaRoute.ParameterSchema> = {
                connectionId: {"in":"path","name":"connectionId","required":true,"dataType":"string"},
        };
        app.post('/connections/:connectionId/close',
            ...(fetchMiddlewares<RequestHandler>(ConnectionController)),
            ...(fetchMiddlewares<RequestHandler>(ConnectionController.prototype.closeConnection)),

            async function ConnectionController_closeConnection(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsConnectionController_closeConnection, request, response });

                const controller = new ConnectionController();

              await templateService.apiHandler({
                methodName: 'closeConnection',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsConnectionController_updateConnection: Record<string, TsoaRoute.ParameterSchema> = {
                connectionId: {"in":"path","name":"connectionId","required":true,"dataType":"string"},
                connection: {"in":"body","name":"connection","required":true,"ref":"Connection"},
        };
        app.post('/connections/:connectionId/update',
            ...(fetchMiddlewares<RequestHandler>(ConnectionController)),
            ...(fetchMiddlewares<RequestHandler>(ConnectionController.prototype.updateConnection)),

            async function ConnectionController_updateConnection(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsConnectionController_updateConnection, request, response });

                const controller = new ConnectionController();

              await templateService.apiHandler({
                methodName: 'updateConnection',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsConnectionController_deleteAllConnections: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.delete('/connections/all',
            ...(fetchMiddlewares<RequestHandler>(ConnectionController)),
            ...(fetchMiddlewares<RequestHandler>(ConnectionController.prototype.deleteAllConnections)),

            async function ConnectionController_deleteAllConnections(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsConnectionController_deleteAllConnections, request, response });

                const controller = new ConnectionController();

              await templateService.apiHandler({
                methodName: 'deleteAllConnections',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

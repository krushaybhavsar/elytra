import { Controller, Get, Route } from 'tsoa';

@Route('trigger')
export class TriggerController extends Controller {
  @Get('health')
  async health() {
    return 'OK';
  }
}

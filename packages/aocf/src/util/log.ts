import pino from 'pino';
import { PrettyTransform } from 'pretty-json-log';

export const log = pino({}, process.stdout.isTTY ? PrettyTransform.stream() : process.stdout);

log.level = 'trace';

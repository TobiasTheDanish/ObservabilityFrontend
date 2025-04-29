export type ResourceUsage = {
	memoryUsage?: {
		id: string;
		sessionId: string;
		installationId: string;
		appId: number;
		freeMemory: number;
		usedMemory: number;
		maxMemory: number;
		totalMemory: number;
		availableHeapSpace: number;
		createdAt: number;
	}[];
};

type Team = {
	id: number;
	name: string;
};

type Application = {
	id: number;
	name: string;
};

type AppData = {
	installations: {
		id: string;
		sdkVersion: number;
		model: string;
		brand: string;
	}[];
	sessions: {
		id: string;
		installationId: string;
		createdAt: number;
		crashed: boolean;
	}[];
};

type ServiceErrorResponse<E extends Error> = {
	success: false;
	errorMessage: string;
	error?: E;
};

type ServiceSuccessResponse<T> = {
	success: true;
	data: T;
};

type ServiceResponse<T = unknown, E extends Error = Error> =
	| ServiceSuccessResponse<T>
	| ServiceErrorResponse<E>;

export type FetchFn = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

import type {
	// The series option types are defined with the SeriesOption suffix
	BarSeriesOption,
	LineSeriesOption
} from 'echarts/charts';
import type {
	// The component option types are defined with the ComponentOption suffix
	TitleComponentOption,
	TooltipComponentOption,
	GridComponentOption,
	DatasetComponentOption
} from 'echarts/components';
import type { ComposeOption } from 'echarts/core';

// Create an Option type with only the required components and charts via ComposeOption
type ECOption = ComposeOption<
	| BarSeriesOption
	| LineSeriesOption
	| TitleComponentOption
	| TooltipComponentOption
	| GridComponentOption
	| DatasetComponentOption
>;

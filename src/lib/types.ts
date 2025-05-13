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

export type Team = {
	id: number;
	name: string;
};

export type Application = {
	id: number;
	name: string;
};

export type AppData = {
	installations: {
		id: string;
		sdkVersion: number;
		model: string;
		brand: string;
		createdAt: number;
	}[];
	sessions: {
		id: string;
		installationId: string;
		createdAt: number;
		crashed: boolean;
	}[];
};

export type InstallationUiState = AppData['installations'][0] & {
	sessions: AppData['sessions'];
};

export type SessionUiState = AppData['sessions'][0] & {
	installation: AppData['installations'][0] | undefined;
};

export type ServiceErrorResponse<E extends Error> = {
	success: false;
	errorMessage: string;
	error?: E;
};

export type ServiceSuccessResponse<T> = {
	success: true;
	data: T;
};

export type ServiceResponse<T = unknown, E extends Error = Error> =
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
export type ECOption = ComposeOption<
	| BarSeriesOption
	| LineSeriesOption
	| TitleComponentOption
	| TooltipComponentOption
	| GridComponentOption
	| DatasetComponentOption
>;

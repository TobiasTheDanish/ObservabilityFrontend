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

export type InstallationType = 'android' | 'go';

type InstallationData = {
	android: AndroidInstallationData;
	go: {};
};

export type AndroidInstallationData = {
	sdkVersion: number;
	model: string;
	brand: string;
};

export type Installation<TType extends InstallationType = InstallationType> = {
	id: string;
	type: TType;
	data: InstallationData[TType];
	createdAt: number;
};

export type Session = {
	id: string;
	installationId: string;
	createdAt: number;
	crashed: boolean;
};

export type AppData = {
	installations: Installation[];
	sessions: Session[];
};

export type InstallationUiState<TType extends InstallationType = InstallationType> =
	Installation<TType> & {
		sessions: Session[];
	};

export type SessionUiState = Session & {
	installation: Installation | undefined;
};

export type Trace = {
	traceId: string;
	sessionId: string;
	groupId: string;
	parentId: string;
	name: string;
	status: string;
	errorMessage: string;
	startTime: number;
	endTime: number;
	hasEnded: boolean;
};

export type GraphTree = GraphTreeNode;

export type GraphTreeNode = {
	depth: number;
	data: Trace;
	children: GraphTreeNode[];
};

export type TraceTree = {
	root: TraceTreeNode;
};

export type TraceTreeNode = {
	depth: number;
	name: string;
	data: Trace[];
	children: TraceTreeNode[];
};

export type AndroidEvent =
	| AndroidLifecycleAppEvent
	| AndroidLifecycleActivityEvent
	| AndroidNavigationEvent
	| AndroidExceptionEvent
	| AndroidCustomEvent;

export type AndroidBaseEvent = {
	id: string;
	sessionId: string;
	createdAt: number;
};

export type AndroidLifecycleAppEvent = AndroidBaseEvent & {
	type: 'lifecycle_app';
	serializedData?: {
		type: 'background' | 'foreground';
	};
};

export type AndroidLifecycleActivityEvent = AndroidBaseEvent & {
	type: 'lifecycle_activity';
	serializedData?: {
		type: 'resumed' | 'paused' | 'started' | 'stopped';
		className: string;
	};
};

export type AndroidNavigationEvent = AndroidBaseEvent & {
	type: 'navigation';
	serializedData?: {
		route: string;
	};
};

export type AndroidExceptionEvent = AndroidBaseEvent & {
	type: 'exception';
	serializedData?: {
		threadName: string;
		handled: boolean;
		exceptionUnits: {
			name: string;
			message?: string;
			frames: {
				className: string;
				methodName: string;
				fileName: string;
				lineNum: number;
			}[];
		}[];
	};
};

export type AndroidCustomEvent = AndroidBaseEvent & {
	type: 'custom';
	serializedData?: any;
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
	CustomSeriesOption,
	LineSeriesOption,
	PieSeriesOption
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
	| PieSeriesOption
	| CustomSeriesOption
	| TitleComponentOption
	| TooltipComponentOption
	| GridComponentOption
	| DatasetComponentOption
>;

export interface ServerToClientEvents {
    personalityConnected: (personalityId: string, cardData: CardData | undefined) => void;
    personalityDisconnected: (personalityId: string) => void;
    personality1Reconnected: (oldId: string, newId: string) => void;
    deleteEntries: (indexes: number[]) => void;
    addEntry: (entry: Entry) => void;
    updateEntryId: (currentId: string) => void;
    createNewUser: (entries: Entry[]) => void;
    construct: (clientData: ClientData) => void;
    cardUpdatedPts: (personalityId: string,value: CardChange) => void;
    cardUpdatedStp: (value: CardChange) => void;
    wheelSet: (pers: {id: string, name: string}[], failRatio: number) => void;
    spinModal: (pers: {id: string, name: string}[], failRatio: number) => void;
    vote: (perId: string, approve: boolean) => void;
    disableVote: () => void;
    enableSpin: () => void;
    spinWheel: (angle: number, success: boolean) => void;
    continueGame: () => void;
    reorderPersonalities: (domiId: string) => void;
    grantScore: (record: GoalRecord) => void;
    requestScore: (perId: string, request: GoalRequest) => void;
    closeModal: () => void;
}

export interface ClientToServerEvents {
    init: (role: ParamData, entries: Entry[]) => void;
    construct: (role: ClientData) => void;
    reconnect: (entry: Entry) => void;
    createRoom: (callback: (roomcode: string) => void) => void;
    cardUpdatedPts: (value: CardChange) => void;
    cardUpdatedStp: (personalityId: string, value: CardChange) => void;
    wheelSet: (failRatio: number) => void;
    vote: (approve: boolean) => void;
    spinWheel: () => void;
    continueGame: () => void;
    grantScore: (perId: string, record: GoalRecord) => void;
    requestScore: (request: GoalRequest) => void;
    responseScore: (perId: string, response: GoalRecord) => void;
    newGame: () => void
}

export interface InterServerEvents {
    // ping: () => void;
}

export interface SocketData {
    // name: string;
    // age: number;
}

export type RoleType = "Storyteller" | "Personality";

export type ParamData =
    { type: "Storyteller",
    } |
    { type: "Personality",
        roomcode: string
    } |
    { type: "NewUser"
    }
;

export type Entry = {
    id: string,
    roomcode: string,
    role: 
    { type: "Storyteller"
    } |
    { type: "Personality"
        name: string
    }
};


export type AbilityData = {
    description: string,
    approved: boolean | undefined
};
export type GoalData = AbilityData & {score: string};

export type AttributeData = AbilityData | GoalData;

export type Storyteller = {
    id: string,
    connected: boolean,
};

export type CardData = {
    name: string,
    abilities: AbilityData[],
    goals: GoalData[],
    score: number
}

export type GoalRecord = 
(
    { accepted: true
        score: number
    } |
    { accepted: false
    }
) &
{
    description: string,
    explanation?: string,
    reason?: string,
}

export type GoalRequest = {
    score: number,
    description: string,
    explanation?: string
}

export type Personality = {
    id: string,
    cardData: CardData,
    connected: boolean,
    stage: number,
    records: GoalRecord[],
    vote?: boolean,
};

export type Room = {
    roomcode: string,
    storyteller: Storyteller,
    personalities: Personality[],
    stage: number,
    abilityCount: number,
    goalCount: number,
    requests: ({perId: string} & GoalRequest)[],
    consecutiveSuccesses: number,
    failRatio?: number,
    timeout?: NodeJS.Timeout
};

export type St0Data = {
    roomcode: string,
    personalities: {
        id: string,
        cardData: CardData,
    }[] | undefined,
};

export type Ps0Data = {
    roomcode: string,
    cardData: CardData | undefined,
};

export type St1Data = {
    requests: ({perId: string} & GoalRequest)[],
    pers: {
        id: string,
        connected: boolean,
        cardData: CardData,
        records: GoalRecord[]
    }[]
};

export type Ps1Data = {
    records: GoalRecord[],
    cardData: CardData,
};

export type ClientData = 
    {   type: "Message",
        message: string,
    } |
    { type: "St0Data", 
        st0Data: St0Data,
    } |
    { type: "Ps0Data",
        ps0Data: Ps0Data,
    } |
    { type: "St1Data",
        st1Data: St1Data,
    } |
    { type: "Ps1Data",
        ps1Data: Ps1Data,
        roomcode: string
    }
;

export type AttributeType = "ability" | "goal";

export type AttributeChange = 
    { type: "description",
        value: string,
    } |
    { type: "checkbox",
        value: boolean,
    } |
    { type: "score",
        value: string,
    }
;

export type CardChange = 
    { type: "name",
        name: string,
    } |
    { type: "attribute",
        columnI: number,
        attributeI: number,
        attributeChange: AttributeChange,
    }
;
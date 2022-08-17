interface ServerToClientEvents {
    personalityConnected: (personalityId: string) => void;
    personalityDisconnected: (personalityId: string) => void;
    cardUpdatedPts: (personalityId: string,value: CardChange) => void
    cardUpdatedStp: (value: CardChange) => void;
}

interface ClientToServerEvents {
    init: (param: string, entries: Entry[], callback: (clientType: ClientType, toDelete: string[]) => void) => void;
    createRoom: (callback: (roomcode: string) => void) => void;
    cardUpdatedPts: (value: CardChange) => void;
    cardUpdatedStp: (personalityId: string, value: CardChange) => void;
}

interface InterServerEvents {
    // ping: () => void;
}

interface SocketData {
    // name: string;
    // age: number;
}


type Role = "storyteller" | "personality";

type Entry = {
    id: string,
    role: Role
}

type ClientType = 
    { type: "Storyteller", 
        roomcode: string,
        data: Room | undefined,
    } |
    { type: "Personality",
        data: Personality | undefined,
    } | 
    { type: "new",
        relevants: string[]
    }

type Attribute = {
    description: string,
    approved: boolean
}

type Goal = {
    attribute: Attribute,
    score: number
}

type Storyteller = {
    id: string,
    connected: boolean,
}

type Personality = {
    id: string,
    name: string,
    abilities: Attribute[],
    goals: Goal[],
    stage: number,
    connected: boolean,
}

type Room = {
    roomcode: string,
    storyteller: Storyteller,
    personalities: Personality[],
    stage: number,
}

type AttributeType = "ability" | "goal";

type AttributeChange = 
    { type: "description"
        value: string
    } |
    { type: "checkbox"
        value: boolean
    } |
    { type: "score"
        value: string
    }
;

type CardChange = 
    { type: "name"
        value: string
    } |
    { type: "attribute"
        columnI: number,
        attributeI: number,
        attributeChangeType: AttributeChange
    }
;
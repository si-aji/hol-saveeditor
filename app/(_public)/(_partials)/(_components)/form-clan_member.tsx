"use client"

import React, { ReactNode } from "react";

// Icons
import { Loader2Icon, Terminal } from "lucide-react";

// Lib
import { indexMapping } from '@/lib/indexMapping';

// Shadcn
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

function FormClanMember({ state, setState }: {
    state: any;
    setState: (state: any) => void;
}) {
    if (state.processing) {
        return (
            <div className="font-semibold text-xl text-center flex flex-row gap-2 items-center justify-center">
                <Loader2Icon className="animate-spin size-6" />
                <span>Loading</span>
            </div>
        );
    } else if (state.es3?.Member_now) {
        const element: ReactNode = state.es3.Member_now.value.map((val: any, index: number) => {
            const generalInfo = val[indexMapping.Member_now.general.index].split("|");
            const [
                name,
                generation,
                talent,
                talentPotential,
                gender,
                lifeSpan,
                skill,
                luck,
                unknown,
                hobby,
            ] = [
                generalInfo[indexMapping.Member_now.general.name],
                generalInfo[indexMapping.Member_now.general.generation],
                generalInfo[indexMapping.Member_now.general.talent],
                generalInfo[indexMapping.Member_now.general.talentPotential],
                generalInfo[indexMapping.Member_now.general.gender],
                generalInfo[indexMapping.Member_now.general.lifeSpan],
                generalInfo[indexMapping.Member_now.general.skill],
                generalInfo[indexMapping.Member_now.general.luck],
                generalInfo[indexMapping.Member_now.general.unknown],
                generalInfo[indexMapping.Member_now.general.hobby],
            ];
            const potential = {
                writing: val[indexMapping.Member_now.potential.writing] ?? 0,
                might: val[indexMapping.Member_now.potential.might] ?? 0,
                business: val[indexMapping.Member_now.potential.business] ?? 0,
                art: val[indexMapping.Member_now.potential.art] ?? 0,
            };

            return (
                <div
                    className="p-4 border rounded flex flex-col gap-6"
                    key={`member_now-${index}`}
                    data-id={val[indexMapping.Member_now.id]}
                >
                    <div className="flex flex-row justify-between gap-4">
                        <div className="flex flex-row gap-1 items-center">
                            {val[indexMapping.Member_now.clan_elder].toString() === "1" && (
                                <Badge>Clan Elder</Badge>
                            )}
                            <span className="font-semibold">Member #{index + 1}</span>
                        </div>
                        <Badge>{val[indexMapping.Member_now.id]}</Badge>
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* General Information */}
                        <div className="flex flex-col gap-1">
                            <Label>Name</Label>
                            <Input placeholder="Spouse Name" value={name} disabled />
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label>Lifespan</Label>
                            <Input
                                type="number"
                                min={parseInt(val[indexMapping.Member_now.age]) + 1}
                                step={1}
                                placeholder="Lifespan"
                                value={lifeSpan}
                                onChange={e => {
                                    let value = parseInt(e.target.value).toString();
                                    if (parseInt(value) < parseInt(val[indexMapping.Member_now.age])) {
                                        value = (parseInt(val[indexMapping.Member_now.age]) + 1).toString();
                                    }
                                    setState((prev: any) => {
                                        if (!prev.es3) return prev;
                                        const Member_now = [...prev.es3.Member_now.value];
                                        const data = [...Member_now[index]];
                                        let general = data[indexMapping.Member_now.general.index].split("|");
                                        general[indexMapping.Member_now.general.lifeSpan] = value;
                                        data[indexMapping.Member_now.general.index] = general.join("|");
                                        Member_now[index] = data;
                                        return {
                                            ...prev,
                                            es3: {
                                                ...prev.es3,
                                                Member_now: {
                                                    ...prev.es3.Member_now,
                                                    value: Member_now,
                                                },
                                            },
                                        };
                                    });
                                }}
                            />
                            <small>Current age: {val[indexMapping.Member_now.age]} yo</small>
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label>Gender</Label>
                            <div className="flex flex-row gap-2">
                                <Button
                                    variant={gender.toString() === "1" ? "default" : "outline"}
                                    disabled
                                >
                                    Male
                                </Button>
                                <Button
                                    variant={gender.toString() === "0" ? "default" : "outline"}
                                    disabled
                                >
                                    Female
                                </Button>
                            </div>
                        </div>

                        {/* Skill */}
                        <div className=" flex flex-row gap-1">
                            <div className=" flex flex-col gap-1 w-7/12">
                                <Label>Skill</Label>
                                <Select
                                    value={skill.toString()}
                                    onValueChange={(value) => {
                                        setState((prev: any) => {
                                            if (!prev.es3) return prev;

                                            const Member_now = [
                                                ...prev.es3.Member_now.value,
                                            ];
                                            const data = [...Member_now[index]]; // clone inner array/object to avoid mutation
                                            let general = data[indexMapping.Member_now.general.index].split("|");
                                            general[indexMapping.Member_now.general.skill] = value;
                                            data[indexMapping.Member_now.general.index] = general.join("|");

                                            if (value === "0") {
                                                data[indexMapping.Member_now.skillLv] = "0";
                                            }
                                            Member_now[index] = data;

                                            return {
                                                ...prev,
                                                es3: {
                                                ...prev.es3,
                                                    Member_now: {
                                                        ...prev.es3.Member_now,
                                                        value: Member_now,
                                                    },
                                                },
                                            };
                                        });
                                    }}
                                >
                                    <SelectTrigger className=" w-full">
                                        <SelectValue placeholder="Select a Skill" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">No Skill</SelectItem>
                                        <SelectItem value="1">Sorcery</SelectItem>
                                        <SelectItem value="2">Medicine</SelectItem>
                                        <SelectItem value="3">Daoism</SelectItem>
                                        <SelectItem value="4">Divination</SelectItem>
                                        <SelectItem value="5">Charisma</SelectItem>
                                        <SelectItem value="6">Technology</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className=" flex flex-col gap-1 w-5/12">
                                <Label>Lv</Label>
                                <Select
                                    value={val[
                                        indexMapping.Member_now.skillLv
                                    ].toString()}
                                    onValueChange={(value) => {
                                        setState((prev: any) => {
                                            if (!prev.es3) return prev;

                                            const Member_now = [
                                                ...prev.es3.Member_now.value,
                                            ];
                                            const data = [...Member_now[index]]; // clone inner array/object to avoid mutation
                                            data[indexMapping.Member_now.skillLv] = value;
                                            Member_now[index] = data;

                                            return {
                                                ...prev,
                                                es3: {
                                                    ...prev.es3,
                                                    Member_now: {
                                                        ...prev.es3.Member_now,
                                                        value: Member_now,
                                                    },
                                                },
                                            };
                                        });
                                    }}
                                    disabled={skill.toString() === "0"}
                                >
                                    <SelectTrigger className=" w-full">
                                        <SelectValue placeholder="Skill Level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">0</SelectItem>
                                        <SelectItem value="1">1</SelectItem>
                                        <SelectItem value="2">2</SelectItem>
                                        <SelectItem value="3">3</SelectItem>
                                        <SelectItem value="4">4</SelectItem>
                                        <SelectItem value="5">5</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Talent */}
                        <div className=" flex flex-row gap-1">
                            <div className=" flex flex-col gap-1 w-7/12">
                                <Label>Talent</Label>
                                <Select
                                    value={talent.toString()}
                                    onValueChange={(value) => {
                                        setState((prev: any) => {
                                            if (!prev.es3) return prev;

                                            const Member_now = [
                                                ...prev.es3.Member_now.value,
                                            ];
                                            const data = [...Member_now[index]]; // clone inner array/object to avoid mutation
                                            let general = data[indexMapping.Member_now.general.index].split("|");
                                            general[indexMapping.Member_now.general.talent] = value;
                                            data[indexMapping.Member_now.general.index] = general.join("|");

                                            if (value === "0") {
                                                let general =
                                                data[indexMapping.Member_now.general.index].split("|");
                                                general[indexMapping.Member_now.general.talentPotential] = "0";
                                                data[indexMapping.Member_now.general.index] = general.join("|");
                                            }
                                            Member_now[index] = data;

                                            return {
                                                ...prev,
                                                es3: {
                                                    ...prev.es3,
                                                    Member_now: {
                                                        ...prev.es3.Member_now,
                                                        value: Member_now,
                                                    },
                                                },
                                            };
                                        });
                                    }}
                                >
                                    <SelectTrigger className=" w-full">
                                        <SelectValue placeholder="Select a Talent" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">No Talent</SelectItem>
                                        <SelectItem value="1">Writing</SelectItem>
                                        <SelectItem value="2">Might</SelectItem>
                                        <SelectItem value="3">Business</SelectItem>
                                        <SelectItem value="4">Art</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className=" flex flex-col gap-1 w-5/12">
                                <Label>Potential</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    max={100}
                                    placeholder="Talent Potential"
                                    value={talentPotential}
                                    disabled={talent === "0"}
                                    onChange={(e) => {
                                        let value = e.target.value.toString();
                                        if (parseInt(value) > 100) {
                                            value = "100";
                                        } else if (parseInt(value) < 0) {
                                            value = "0";
                                        }

                                        setState((prev: any) => {
                                            if (!prev.es3) return prev;

                                            const Member_now = [
                                                ...prev.es3.Member_now.value,
                                            ];
                                            const data = [...Member_now[index]]; // clone inner array/object to avoid mutation
                                            let general = data[indexMapping.Member_now.general.index].split("|");
                                            general[indexMapping.Member_now.general.talentPotential] = value;
                                            data[indexMapping.Member_now.general.index] = general.join("|");

                                            Member_now[index] = data;

                                            return {
                                                ...prev,
                                                es3: {
                                                    ...prev.es3,
                                                    Member_now: {
                                                        ...prev.es3.Member_now,
                                                        value: Member_now,
                                                    },
                                                },
                                            };
                                        });
                                    }}
                                />
                            </div>
                        </div>

                        {/* Potential */}
                        <div className=" flex flex-col gap-1">
                            <Label>Writing</Label>
                            <Input
                                type="number"
                                min={0}
                                max={100}
                                placeholder="Potential - Writing"
                                value={potential.writing}
                                onChange={(e) => {
                                    let value = e.target.value.toString();
                                    if (parseInt(value) > 100) {
                                        value = "100";
                                    } else if (parseInt(value) < 0) {
                                        value = "0";
                                    }

                                    setState((prev: any) => {
                                        if (!prev.es3) return prev;

                                        const Member_now = [
                                            ...prev.es3.Member_now.value,
                                        ];
                                        const data = [...Member_now[index]]; // clone inner array/object to avoid mutation
                                        data[indexMapping.Member_now.potential.writing] = value;
                                        Member_now[index] = data;

                                        return {
                                            ...prev,
                                            es3: {
                                                ...prev.es3,
                                                Member_now: {
                                                ...prev.es3.Member_now,
                                                value: Member_now,
                                                },
                                            },
                                        };
                                    });
                                }}
                            />
                        </div>
                        <div className=" flex flex-col gap-1">
                        <Label>Might</Label>
                            <Input
                                type="number"
                                min={0}
                                max={100}
                                placeholder="Potential - Might"
                                value={potential.might}
                                onChange={(e) => {
                                    let value = e.target.value.toString();
                                    if (parseInt(value) > 100) {
                                        value = "100";
                                    } else if (parseInt(value) < 0) {
                                        value = "0";
                                    }

                                    setState((prev: any) => {
                                        if (!prev.es3) return prev;

                                        const Member_now = [
                                            ...prev.es3.Member_now.value,
                                        ];
                                        const data = [...Member_now[index]]; // clone inner array/object to avoid mutation
                                        data[indexMapping.Member_now.potential.might] = value;
                                        Member_now[index] = data;

                                        return {
                                            ...prev,
                                            es3: {
                                                ...prev.es3,
                                                Member_now: {
                                                    ...prev.es3.Member_now,
                                                    value: Member_now,
                                                },
                                            },
                                        };
                                    });
                                }}
                            />
                        </div>
                        <div className=" flex flex-col gap-1">
                        <Label>Business</Label>
                            <Input
                                type="number"
                                min={0}
                                max={100}
                                placeholder="Potential - Business"
                                value={potential.business}
                                onChange={(e) => {
                                    let value = e.target.value.toString();
                                    if (parseInt(value) > 100) {
                                        value = "100";
                                    } else if (parseInt(value) < 0) {
                                        value = "0";
                                    }

                                    setState((prev: any) => {
                                        if (!prev.es3) return prev;

                                        const Member_now = [
                                            ...prev.es3.Member_now.value,
                                        ];
                                        const data = [...Member_now[index]]; // clone inner array/object to avoid mutation
                                        data[indexMapping.Member_now.potential.business] = value;
                                        Member_now[index] = data;

                                        return {
                                            ...prev,
                                            es3: {
                                                ...prev.es3,
                                                Member_now: {
                                                    ...prev.es3.Member_now,
                                                    value: Member_now,
                                                },
                                            },
                                        };
                                    });
                                }}
                            />
                        </div>
                        <div className=" flex flex-col gap-1">
                            <Label>Art</Label>
                            <Input
                                type="number"
                                min={0}
                                max={100}
                                placeholder="Potential - Art"
                                value={potential.art}
                                onChange={(e) => {
                                    let value = e.target.value.toString();
                                    if (parseInt(value) > 100) {
                                        value = "100";
                                    } else if (parseInt(value) < 0) {
                                        value = "0";
                                    }

                                    setState((prev: any) => {
                                        if (!prev.es3) return prev;

                                        const Member_now = [
                                            ...prev.es3.Member_now.value,
                                        ];
                                        const data = [...Member_now[index]]; // clone inner array/object to avoid mutation
                                        data[indexMapping.Member_now.potential.art] = value;
                                        Member_now[index] = data;

                                        return {
                                            ...prev,
                                            es3: {
                                                ...prev.es3,
                                                Member_now: {
                                                    ...prev.es3.Member_now,
                                                    value: Member_now,
                                                },
                                            },
                                        };
                                    });
                                }}
                            />
                        </div>

                        {/* Misc */}
                        <div className=" grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className=" flex flex-col gap-1">
                                <Label>Luck</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    max={100}
                                    placeholder="Luck"
                                    value={luck}
                                    onChange={(e) => {
                                        let value = e.target.value.toString();
                                        if (parseInt(value) > 100) {
                                        value = "100";
                                        } else if (parseInt(value) < 0) {
                                        value = "0";
                                        }

                                        setState((prev: any) => {
                                            if (!prev.es3) return prev;

                                            const Member_now = [
                                                ...prev.es3.Member_now.value,
                                            ];
                                            const data = [...Member_now[index]]; // clone inner array/object to avoid mutation
                                            let general = data[indexMapping.Member_now.general.index].split("|");
                                            general[indexMapping.Member_now.general.luck] = value;
                                            data[indexMapping.Member_now.general.index] = general.join("|");

                                            Member_now[index] = data;

                                            return {
                                                ...prev,
                                                es3: {
                                                    ...prev.es3,
                                                    Member_now: {
                                                        ...prev.es3.Member_now,
                                                        value: Member_now,
                                                    },
                                                },
                                            };
                                        });
                                    }}
                                />
                            </div>
                            <div className=" flex flex-col gap-1">
                                <Label>Charisma</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    max={100}
                                    placeholder="Luck"
                                    value={
                                        val[indexMapping.Member_now.charisma]
                                    }
                                    onChange={(e) => {
                                        let value = e.target.value.toString();
                                        if (parseInt(value) > 100) {
                                            value = "100";
                                        } else if (parseInt(value) < 0) {
                                            value = "0";
                                        }

                                        setState((prev: any) => {
                                            if (!prev.es3) return prev;

                                            const Member_now = [
                                                ...prev.es3.Member_now.value,
                                            ];
                                            const data = [...Member_now[index]]; // clone inner array/object to avoid mutation
                                            data[indexMapping.Member_now.charisma] = value;
                                            Member_now[index] = data;

                                            return {
                                                ...prev,
                                                es3: {
                                                    ...prev.es3,
                                                    Member_now: {
                                                        ...prev.es3.Member_now,
                                                        value: Member_now,
                                                    },
                                                },
                                            };
                                        });
                                    }}
                                />
                            </div>
                            <div className=" flex flex-col gap-1">
                                <Label>Cunning</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    max={100}
                                    placeholder="Cunning"
                                    value={val[indexMapping.Member_now.cunning]}
                                    onChange={(e) => {
                                        let value = e.target.value.toString();
                                        if (parseInt(value) > 100) {
                                            value = "100";
                                        } else if (parseInt(value) < 0) {
                                            value = "0";
                                        }

                                        setState((prev: any) => {
                                            if (!prev.es3) return prev;

                                            const Member_now = [
                                                ...prev.es3.Member_now.value,
                                            ];
                                            const data = [...Member_now[index]]; // clone inner array/object to avoid mutation
                                            data[indexMapping.Member_now.cunning] = value;
                                            Member_now[index] = data;

                                            return {
                                                ...prev,
                                                es3: {
                                                    ...prev.es3,
                                                    Member_now: {
                                                        ...prev.es3.Member_now,
                                                        value: Member_now,
                                                    },
                                                },
                                            };
                                        });
                                    }}
                                />
                            </div>
                            <div className=" flex flex-col gap-1">
                                <Label>Renown</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    max={100}
                                    placeholder="Renown"
                                    value={val[indexMapping.Member_now.renown]}
                                    onChange={(e) => {
                                        let value = e.target.value.toString();
                                        if (parseInt(value) > 100) {
                                            value = "100";
                                        } else if (parseInt(value) < 0) {
                                            value = "0";
                                        }

                                        setState((prev: any) => {
                                            if (!prev.es3) return prev;

                                            const Member_now = [
                                                ...prev.es3.Member_now.value,
                                            ];
                                            const data = [...Member_now[index]]; // clone inner array/object to avoid mutation
                                            data[indexMapping.Member_now.renown] = value;
                                            Member_now[index] = data;

                                            return {
                                                ...prev,
                                                es3: {
                                                    ...prev.es3,
                                                    Member_now: {
                                                        ...prev.es3.Member_now,
                                                        value: Member_now,
                                                    },
                                                },
                                            };
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
        
        return <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">{element}</div>;
    }

    return (
        <Alert variant="destructive">
            <Terminal />
            <AlertTitle>Missing key!</AlertTitle>
        </Alert>
    );
}

export default React.memo(FormClanMember);
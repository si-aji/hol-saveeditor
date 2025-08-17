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

function FormClanRetainer({ state, setState }: {
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
    } else if (state.es3?.MenKe_Now) {
        const element: ReactNode[] = state.es3.MenKe_Now.value.map((val: any, index: number) => {
            const generalInfo = val[indexMapping.MenKe_Now.general.index].split("|");
            const [
                name,
                unknown,
                talent,
                talentPotential,
                gender,
                lifeSpan,
                skill,
                luck,
                trait,
                unknown_1,
            ] = [
                generalInfo[indexMapping.MenKe_Now.general.name],
                generalInfo[indexMapping.MenKe_Now.general.unknown],
                generalInfo[indexMapping.MenKe_Now.general.talent],
                generalInfo[indexMapping.MenKe_Now.general.talentPotential],
                generalInfo[indexMapping.MenKe_Now.general.gender],
                generalInfo[indexMapping.MenKe_Now.general.lifeSpan],
                generalInfo[indexMapping.MenKe_Now.general.skill],
                generalInfo[indexMapping.MenKe_Now.general.luck],
                generalInfo[indexMapping.MenKe_Now.general.trait],
                generalInfo[indexMapping.MenKe_Now.general.unknown_1],
            ];
            // Potential
            let potential = {
                writing: val[indexMapping.MenKe_Now.potential.writing] ?? 0,
                might: val[indexMapping.MenKe_Now.potential.might] ?? 0,
                business: val[indexMapping.MenKe_Now.potential.business] ?? 0,
                art: val[indexMapping.MenKe_Now.potential.art] ?? 0,
            };

            return (
                <div
                    className="p-4 border rounded flex flex-col gap-6"
                    key={`menke_now-${index}`}
                >
                    <div className="flex flex-row justify-between gap-4">
                        <div className="flex flex-row gap-1 items-center">
                            <span className="font-semibold">Retainer #{index + 1}</span>
                        </div>
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
                                min={parseInt(val[indexMapping.MenKe_Now.age]) + 1}
                                step={1}
                                placeholder="Lifespan"
                                value={lifeSpan}
                                onChange={e => {
                                    let value = parseInt(e.target.value).toString();
                                    if (parseInt(value) < parseInt(val[indexMapping.MenKe_Now.age])) {
                                        value = (parseInt(val[indexMapping.MenKe_Now.age]) + 1).toString();
                                    }
                                    setState((prev: any) => {
                                        if (!prev.es3) return prev;
                                        const MenKe_Now = [...prev.es3.MenKe_Now.value];
                                        const data = [...MenKe_Now[index]];
                                        let general = data[indexMapping.MenKe_Now.general.index].split("|");
                                        general[indexMapping.MenKe_Now.general.lifeSpan] = value;
                                        data[indexMapping.MenKe_Now.general.index] = general.join("|");
                                        MenKe_Now[index] = data;
                                        return {
                                            ...prev,
                                            es3: {
                                                ...prev.es3,
                                                MenKe_Now: {
                                                    ...prev.es3.MenKe_Now,
                                                    value: MenKe_Now,
                                                },
                                            },
                                        };
                                    });
                                }}
                            />
                            <small>Current age: {val[indexMapping.MenKe_Now.age]} yo</small>
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

                                            const MenKe_Now = [
                                                ...prev.es3.MenKe_Now.value,
                                            ];
                                            const data = [...MenKe_Now[index]]; // clone inner array/object to avoid mutation
                                            let general = data[indexMapping.MenKe_Now.general.index].split("|");
                                            general[indexMapping.MenKe_Now.general.skill] = value;
                                            data[indexMapping.MenKe_Now.general.index] = general.join("|");

                                            if (value === "0") {
                                                data[indexMapping.MenKe_Now.skillLv] = "0";
                                            }
                                            MenKe_Now[index] = data;

                                            return {
                                                ...prev,
                                                es3: {
                                                    ...prev.es3,
                                                    MenKe_Now: {
                                                        ...prev.es3.MenKe_Now,
                                                        value: MenKe_Now,
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
                                        indexMapping.MenKe_Now.skillLv
                                    ].toString()}
                                    onValueChange={(value) => {
                                        setState((prev: any) => {
                                            if (!prev.es3) return prev;

                                            const MenKe_Now = [
                                                ...prev.es3.MenKe_Now.value,
                                            ];
                                            const data = [...MenKe_Now[index]]; // clone inner array/object to avoid mutation
                                            data[indexMapping.MenKe_Now.skillLv] = value;
                                            MenKe_Now[index] = data;

                                            return {
                                                ...prev,
                                                es3: {
                                                    ...prev.es3,
                                                    MenKe_Now: {
                                                        ...prev.es3.MenKe_Now,
                                                        value: MenKe_Now,
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

                                            const MenKe_Now = [
                                                ...prev.es3.MenKe_Now.value,
                                            ];
                                            const data = [...MenKe_Now[index]]; // clone inner array/object to avoid mutation
                                            let general = data[indexMapping.MenKe_Now.general.index].split("|");
                                            general[indexMapping.MenKe_Now.general.talent] = value;
                                            data[indexMapping.MenKe_Now.general.index] = general.join("|");

                                            if (value === "0") {
                                                let general = data[indexMapping.MenKe_Now.general.index].split("|");
                                                general[indexMapping.MenKe_Now.general.talentPotential] = "0";
                                                data[indexMapping.MenKe_Now.general.index] = general.join("|");
                                            }
                                            MenKe_Now[index] = data;

                                            return {
                                                ...prev,
                                                es3: {
                                                    ...prev.es3,
                                                    MenKe_Now: {
                                                        ...prev.es3.MenKe_Now,
                                                        value: MenKe_Now,
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

                                            const MenKe_Now = [
                                                ...prev.es3.MenKe_Now.value,
                                            ];
                                            const data = [...MenKe_Now[index]]; // clone inner array/object to avoid mutation
                                            let general = data[indexMapping.MenKe_Now.general.index].split("|");
                                            general[indexMapping.MenKe_Now.general.talentPotential] = value;
                                            data[indexMapping.MenKe_Now.general.index] = general.join("|");

                                            MenKe_Now[index] = data;

                                            return {
                                                ...prev,
                                                es3: {
                                                    ...prev.es3,
                                                    MenKe_Now: {
                                                        ...prev.es3.MenKe_Now,
                                                        value: MenKe_Now,
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

                                        const MenKe_Now = [
                                            ...prev.es3.MenKe_Now.value,
                                        ];
                                        const data = [...MenKe_Now[index]]; // clone inner array/object to avoid mutation
                                        data[indexMapping.MenKe_Now.potential.writing] = value;
                                        MenKe_Now[index] = data;

                                        return {
                                        ...prev,
                                        es3: {
                                            ...prev.es3,
                                            MenKe_Now: {
                                                ...prev.es3.MenKe_Now,
                                                value: MenKe_Now,
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

                                        const MenKe_Now = [
                                            ...prev.es3.MenKe_Now.value,
                                        ];
                                        const data = [...MenKe_Now[index]]; // clone inner array/object to avoid mutation
                                        data[indexMapping.MenKe_Now.potential.might] = value;
                                        MenKe_Now[index] = data;

                                        return {
                                            ...prev,
                                            es3: {
                                                ...prev.es3,
                                                MenKe_Now: {
                                                    ...prev.es3.MenKe_Now,
                                                    value: MenKe_Now,
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

                                        const MenKe_Now = [
                                            ...prev.es3.MenKe_Now.value,
                                        ];
                                        const data = [...MenKe_Now[index]]; // clone inner array/object to avoid mutation
                                        data[indexMapping.MenKe_Now.potential.business] = value;
                                        MenKe_Now[index] = data;

                                        return {
                                            ...prev,
                                            es3: {
                                                ...prev.es3,
                                                MenKe_Now: {
                                                    ...prev.es3.MenKe_Now,
                                                    value: MenKe_Now,
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

                                        const MenKe_Now = [
                                            ...prev.es3.MenKe_Now.value,
                                        ];
                                        const data = [...MenKe_Now[index]]; // clone inner array/object to avoid mutation
                                        data[indexMapping.MenKe_Now.potential.art] = value;
                                        MenKe_Now[index] = data;

                                        return {
                                            ...prev,
                                            es3: {
                                                ...prev.es3,
                                                MenKe_Now: {
                                                    ...prev.es3.MenKe_Now,
                                                    value: MenKe_Now,
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

                                            const MenKe_Now = [
                                                ...prev.es3.MenKe_Now.value,
                                            ];
                                            const data = [...MenKe_Now[index]]; // clone inner array/object to avoid mutation
                                            let general = data[indexMapping.MenKe_Now.general.index].split("|");
                                            general[indexMapping.MenKe_Now.general.luck] = value;
                                            data[indexMapping.MenKe_Now.general.index] = general.join("|");

                                            MenKe_Now[index] = data;

                                            return {
                                                ...prev,
                                                es3: {
                                                    ...prev.es3,
                                                    MenKe_Now: {
                                                        ...prev.es3.MenKe_Now,
                                                        value: MenKe_Now,
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
                                        val[indexMapping.MenKe_Now.charisma]
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

                                            const MenKe_Now = [
                                                ...prev.es3.MenKe_Now.value,
                                            ];
                                            const data = [...MenKe_Now[index]]; // clone inner array/object to avoid mutation
                                            data[indexMapping.MenKe_Now.charisma] = value;
                                            MenKe_Now[index] = data;

                                            return {
                                                ...prev,
                                                es3: {
                                                    ...prev.es3,
                                                    MenKe_Now: {
                                                        ...prev.es3.MenKe_Now,
                                                        value: MenKe_Now,
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
                                    value={val[indexMapping.MenKe_Now.cunning]}
                                    onChange={(e) => {
                                        let value = e.target.value.toString();
                                        if (parseInt(value) > 100) {
                                            value = "100";
                                        } else if (parseInt(value) < 0) {
                                            value = "0";
                                        }

                                        setState((prev: any) => {
                                            if (!prev.es3) return prev;

                                            const MenKe_Now = [
                                                ...prev.es3.MenKe_Now.value,
                                            ];
                                            const data = [...MenKe_Now[index]]; // clone inner array/object to avoid mutation
                                            data[indexMapping.MenKe_Now.cunning] = value;
                                            MenKe_Now[index] = data;

                                            return {
                                                ...prev,
                                                es3: {
                                                    ...prev.es3,
                                                    MenKe_Now: {
                                                        ...prev.es3.MenKe_Now,
                                                        value: MenKe_Now,
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
                                    value={
                                        val[indexMapping.MenKe_Now.renown]
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

                                            const MenKe_Now = [
                                                ...prev.es3.MenKe_Now.value,
                                            ];
                                            const data = [...MenKe_Now[index]]; // clone inner array/object to avoid mutation
                                            data[indexMapping.MenKe_Now.renown] = value;
                                            MenKe_Now[index] = data;

                                            return {
                                                ...prev,
                                                es3: {
                                                    ...prev.es3,
                                                    MenKe_Now: {
                                                        ...prev.es3.MenKe_Now,
                                                        value: MenKe_Now,
                                                    },
                                                },
                                            };
                                        });
                                    }}
                                />
                            </div>
                        </div>

                        <div className=" flex flex-col gap-1">
                            <Label>Monthly Pay</Label>
                            <Input
                                type="number"
                                min={0}
                                placeholder="Monthly Pay"
                                value={val[indexMapping.MenKe_Now.monthlyPay]}
                                onChange={(e) => {
                                    let value = e.target.value.toString();

                                    setState((prev: any) => {
                                        if (!prev.es3) return prev;

                                        const MenKe_Now = [
                                            ...prev.es3.MenKe_Now.value,
                                        ];
                                        const data = [...MenKe_Now[index]]; // clone inner array/object to avoid mutation

                                        data[indexMapping.MenKe_Now.monthlyPay] = value;
                                        MenKe_Now[index] = data;

                                        return {
                                            ...prev,
                                            es3: {
                                                ...prev.es3,
                                                MenKe_Now: {
                                                ...prev.es3.MenKe_Now,
                                                value: MenKe_Now,
                                                },
                                            },
                                        };
                                    });
                                }}
                            />
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

export default React.memo(FormClanRetainer);
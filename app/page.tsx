"use client"

import { ReactNode, useEffect, useState } from "react";

// Icons
import { Terminal } from "lucide-react";

// Plugins
import VanillaJSONEditor from '@/components/plugins/vanilla-json-editor';

// Shadcn
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type SaveData = {
    [key: string]: any; // biar tetap fleksibel untuk key lainnya
};

// Index Map
const memberNowGeneralInfoIndexMap: Record<string, number> = {
  name: 0, // ./
  generation: 1,
  talent: 2, // ./
  talentPotential: 3, // ./
  gender: 4,
  lifeSpan: 5, // ./
  skill: 6, // ./
  luck: 7, // ./
  unknown: 8,
  hobby: 9,
};
const memberQuGeneralInfoIndexMap: Record<string, number> = {
  name: 0, 
  clan: 1,
  talent: 2, 
  talentPotential: 3, 
  gender: 4,
  lifeSpan: 5, 
  skill: 6, 
  luck: 7, 
  trait: 8,
  marryTo: 9,
  hobby: 10,
  unknown: 11,
};

export default function Home() {
  const [state, setState] = useState<SaveData | null>(null);

  // File Upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState(null)
    const file = event.target.files?.[0]
    if (!file) return

    // 1. Validate extension
    if (!file.name.toLowerCase().endsWith(".es3")) {
      toast.error("Invalid file format. Please upload a .es3 file.");
      return;
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = reader.result as string;
        const jsonData = JSON.parse(text);

        // 2. Validate required keys
        const requiredKeys = ["Member_now", "Prop_have", "CGNum"];
        const missingKeys = requiredKeys.filter((key) => !(key in jsonData));

        if (missingKeys.length > 0) {
          toast.error(
            `Invalid game save file. Missing keys: ${missingKeys.join(", ")}`
          );
          return;
        }

        // ✅ Passed all validations
        setState(jsonData)
      } catch (error) {
        toast.error("Invalid JSON format in the file.");
      }
    }

    reader.readAsText(file)
  }

  useEffect(() => {
    console.log(state?.CGNum)
  }, [state])

  return (
    <div className=" container mx-auto py-10">
      <div className=" flex flex-col gap-10 items-center">
        {/* Heading */}
        <div className=" flex flex-col gap-2 items-center">
          <h1 className=" text-2xl font-bold leading-none">House of Legacy</h1>
          <span className=" text-lg font-semibold leading-none">EasySave Editor</span>
        </div>

        {/* Body */}
        <div className=" flex flex-col gap-4 w-full">
          <div className="max-w-md w-full">
            <Input type="file" onChange={handleFileChange}/>
          </div>

          <div className="">
            <Tabs defaultValue="form" className="">
              <TabsList>
                <TabsTrigger value="json">JSON</TabsTrigger>
                <TabsTrigger value="form">Form</TabsTrigger>
              </TabsList>
              {/* JSON Editor */}
              <TabsContent value="json" className=" w-full sample-cbd">
                <VanillaJSONEditor content={state ? {json: state} : {text: ''}} onChange={(content) => {
                  if ('json' in content && content.json) {
                    setState(content.json as SaveData) // 👈 kasih tahu TS tipenya
                  }
                }}/>
              </TabsContent>

              {/* Form Editor */}
              <TabsContent value="form">
                <Accordion
                  type="single"
                  collapsible
                  className="w-full"
                  defaultValue="Member_qu"
                >
                  <AccordionItem value="Member_now">
                    <AccordionTrigger>Clan Member</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance">
                      {(() => {
                        if(state?.Member_now){
                          let element: ReactNode[] = [];
                          state.Member_now.value.map((val: any, index: number) => {
                            const raw = val[4];
                            const [name, generation, talent, talentPotential, gender, lifeSpan, skill, luck, unknown, hobby] = raw.split('|');
                            // Potential
                            let potential = {
                              writing: val[7] ?? 0,
                              might: val[8] ?? 0,
                              business: val[9] ?? 0,
                              art: val[10] ?? 0,
                            }

                            element.push(
                              <div className=" p-4 border rounded flex flex-col gap-6" key={`member_now-${index}`}>
                                <div className=" flex flex-row gap-1 items-center">
                                  {val[22].toString() === "1" && <Badge>Clan Elder</Badge>}
                                  <span className=" font-semibold">Member #{index + 1}</span>
                                </div>

                                <div className=" flex flex-col gap-4">
                                  {/* General Information */}
                                  <div className=" flex flex-col gap-1">
                                    <Label>Name</Label>
                                    <Input placeholder="Member Name" value={name} onChange={(e) => {
                                      const value = e.target.value;
                                      setState((prev) => {
                                        if (!prev?.Member_now) return prev;
                                        const updatedValues = [...prev.Member_now.value];
                                        const val = [...updatedValues[index]];
                                        
                                        // update raw string part [4], index 0 (name)
                                        const parts = val[4].split('|');
                                        parts[memberNowGeneralInfoIndexMap.name] = value;
                                        val[4] = parts.join('|');

                                        updatedValues[index] = val;

                                        return {
                                          ...prev,
                                          Member_now: {
                                            ...prev.Member_now,
                                            value: updatedValues,
                                          },
                                        };
                                      });
                                    }}/>
                                  </div>

                                  <div className=" flex flex-col gap-1">
                                    <Label>Lifespan</Label>
                                    <Input type="number" min={0} step={1} placeholder="Lifespan" value={lifeSpan} onChange={(e) => {
                                      const value = e.target.value;
                                      setState((prev) => {
                                        if (!prev?.Member_now) return prev;
                                        const updatedValues = [...prev.Member_now.value];
                                        const val = [...updatedValues[index]];
                                        
                                        // update raw string part [4], index 0 (name)
                                        const parts = val[4].split('|');
                                        parts[memberNowGeneralInfoIndexMap.lifeSpan] = value;
                                        val[4] = parts.join('|');

                                        updatedValues[index] = val;

                                        return {
                                          ...prev,
                                          Member_now: {
                                            ...prev.Member_now,
                                            value: updatedValues,
                                          },
                                        };
                                      });
                                    }}/>
                                    <small>Current age: {val[6]} yo</small>
                                  </div>

                                  <div className=" flex flex-col gap-1">
                                    <Label>Gender</Label>
                                    <div className=" flex flex-row gap-2">
                                      <Button variant={gender.toString() === '1' ? 'default' : 'outline'} disabled>Male</Button>
                                      <Button variant={gender.toString() === '0' ? 'default' : 'outline'} disabled>Female</Button>
                                    </div>
                                  </div>

                                  <div className=" flex flex-row gap-1">
                                    <div className=" flex flex-col gap-1 w-2/3">
                                      <Label>Skill</Label>
                                      <Select 
                                        value={skill.toString()}
                                        onValueChange={(value) => {
                                          setState((prev) => {
                                            if (!prev?.Member_now) return prev;
                                            const updatedValues = [...prev.Member_now.value];
                                            const val = [...updatedValues[index]];

                                            // update raw string part [4], index 0 (name)
                                            const parts = val[4].split('|');
                                            parts[memberNowGeneralInfoIndexMap.skill] = value;
                                            val[4] = parts.join('|');

                                            if(value === "0"){
                                              val[33] = "0";
                                            }

                                            updatedValues[index] = val;

                                            return {
                                              ...prev,
                                              Member_now: {
                                                ...prev.Member_now,
                                                value: updatedValues,
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
                                    <div className=" flex flex-col gap-1 w-1/3">
                                      <Label>Lv</Label>
                                      <Select 
                                        value={val[33].toString()}
                                        onValueChange={(value) => {
                                          setState((prev) => {
                                            if (!prev?.Member_now) return prev;
                                            const updatedValues = [...prev.Member_now.value];
                                            const val = [...updatedValues[index]];
                                            val[33] = value;
                                            updatedValues[index] = val;

                                            return {
                                              ...prev,
                                              Member_now: {
                                                ...prev.Member_now,
                                                value: updatedValues,
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

                                  <div className=" flex flex-col gap-1">
                                    <Label>Talent</Label>
                                    <Select 
                                      value={talent.toString()}
                                      onValueChange={(value) => {
                                        setState((prev) => {
                                          if (!prev?.Member_now) return prev;
                                          const updatedValues = [...prev.Member_now.value];
                                          const val = [...updatedValues[index]];
                                          
                                          // update raw string part [4], index 0 (name)
                                          const parts = val[4].split('|');
                                          parts[memberNowGeneralInfoIndexMap.talent] = value;
                                          val[4] = parts.join('|');

                                          updatedValues[index] = val;

                                          return {
                                            ...prev,
                                            Member_now: {
                                              ...prev.Member_now,
                                              value: updatedValues,
                                            },
                                          };
                                        });
                                      }}
                                    >
                                      <SelectTrigger className=" w-full">
                                        <SelectValue placeholder="Select a Talent" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="1">Wrtting</SelectItem>
                                        <SelectItem value="2">Might</SelectItem>
                                        <SelectItem value="3">Business</SelectItem>
                                        <SelectItem value="4">Art</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className=" flex flex-col gap-1">
                                    <Label>Talent Potential</Label>
                                    <Input type="number" min={0} max={100} step={0.00001} placeholder="Talent Potential" value={talentPotential} onChange={(e) => {
                                      let value = e.target.value;
                                      if(parseInt(value) > 100){
                                        value = "100";
                                      }

                                      setState((prev) => {
                                        if (!prev?.Member_now) return prev;
                                        const updatedValues = [...prev.Member_now.value];
                                        const val = [...updatedValues[index]];
                                        
                                        // update raw string part [4], index 0 (name)
                                        const parts = val[4].split('|');
                                        parts[memberNowGeneralInfoIndexMap.talentPotential] = value;
                                        val[4] = parts.join('|');

                                        updatedValues[index] = val;

                                        return {
                                          ...prev,
                                          Member_now: {
                                            ...prev.Member_now,
                                            value: updatedValues,
                                          },
                                        };
                                      });
                                    }}/>
                                  </div>

                                  {/* Potential */}
                                  <div className=" flex flex-col gap-1">
                                    <Label>Writting</Label>
                                    <Input type="number" min={0} max={100} step={0.00001} placeholder="Potential - Writting" value={potential.writing} onChange={(e) => {
                                      let value = e.target.value;
                                      if(parseInt(value) > 100){
                                        value = "100";
                                      }

                                      setState((prev) => {
                                        if (!prev?.Member_now) return prev;
                                        const updatedValues = [...prev.Member_now.value];
                                        const val = [...updatedValues[index]];
                                        val[7] = value;
                                        updatedValues[index] = val;

                                        return {
                                          ...prev,
                                          Member_now: {
                                            ...prev.Member_now,
                                            value: updatedValues,
                                          },
                                        };
                                      });
                                    }}/>
                                  </div>
                                  <div className=" flex flex-col gap-1">
                                    <Label>Might</Label>
                                    <Input type="number" min={0} max={100} step={0.00001} placeholder="Potential - Writting" value={potential.might} onChange={(e) => {
                                      let value = e.target.value;
                                      if(parseInt(value) > 100){
                                        value = "100";
                                      }

                                      setState((prev) => {
                                        if (!prev?.Member_now) return prev;
                                        const updatedValues = [...prev.Member_now.value];
                                        const val = [...updatedValues[index]];
                                        val[8] = value;
                                        updatedValues[index] = val;

                                        return {
                                          ...prev,
                                          Member_now: {
                                            ...prev.Member_now,
                                            value: updatedValues,
                                          },
                                        };
                                      });
                                    }}/>
                                  </div>
                                  <div className=" flex flex-col gap-1">
                                    <Label>Business</Label>
                                    <Input type="number" min={0} max={100} step={0.00001} placeholder="Potential - Writting" value={potential.business} onChange={(e) => {
                                      let value = e.target.value;
                                      if(parseInt(value) > 100){
                                        value = "100";
                                      }
                                      
                                      setState((prev) => {
                                        if (!prev?.Member_now) return prev;
                                        const updatedValues = [...prev.Member_now.value];
                                        const val = [...updatedValues[index]];
                                        val[9] = value;
                                        updatedValues[index] = val;

                                        return {
                                          ...prev,
                                          Member_now: {
                                            ...prev.Member_now,
                                            value: updatedValues,
                                          },
                                        };
                                      });
                                    }}/>
                                  </div>
                                  <div className=" flex flex-col gap-1">
                                    <Label>Art</Label>
                                    <Input type="number" min={0} max={100} step={0.00001} placeholder="Potential - Writting" value={potential.art} onChange={(e) => {
                                      let value = e.target.value;
                                      if(parseInt(value) > 100){
                                        value = "100";
                                      }

                                      setState((prev) => {
                                        if (!prev?.Member_now) return prev;
                                        const updatedValues = [...prev.Member_now.value];
                                        const val = [...updatedValues[index]];
                                        val[10] = value;
                                        updatedValues[index] = val;

                                        return {
                                          ...prev,
                                          Member_now: {
                                            ...prev.Member_now,
                                            value: updatedValues,
                                          },
                                        };
                                      });
                                    }}/>
                                  </div>

                                  {/* Misc */}
                                  <div className=" grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div className=" flex flex-col gap-1">
                                      <Label>Luck</Label>
                                      <Input type="number" min={0} max={100} step={0.00001} placeholder="Luck" value={luck} onChange={(e) => {
                                        let value = e.target.value;
                                        if(parseInt(value) > 100){
                                          value = "100";
                                        }

                                        setState((prev) => {
                                          if (!prev?.Member_now) return prev;
                                          const updatedValues = [...prev.Member_now.value];
                                          const val = [...updatedValues[index]];
                                          
                                          // update raw string part [4], index 0 (name)
                                          const parts = val[4].split('|');
                                          parts[memberNowGeneralInfoIndexMap.luck] = value;
                                          val[4] = parts.join('|');

                                          updatedValues[index] = val;

                                          return {
                                            ...prev,
                                            Member_now: {
                                              ...prev.Member_now,
                                              value: updatedValues,
                                            },
                                          };
                                        });
                                      }}/>
                                    </div>
                                    <div className=" flex flex-col gap-1">
                                      <Label>Charisma</Label>
                                      <Input type="number" min={0} max={100} step={0.00001} placeholder="Luck" value={val[20]} onChange={(e) => {
                                        let value = e.target.value;
                                        if(parseInt(value) > 100){
                                          value = "100";
                                        }
                                        setState((prev) => {
                                          if (!prev?.Member_now) return prev;
                                          const updatedValues = [...prev.Member_now.value];
                                          const val = [...updatedValues[index]];
                                          val[20] = value;
                                          updatedValues[index] = val;

                                          return {
                                            ...prev,
                                            Member_now: {
                                              ...prev.Member_now,
                                              value: updatedValues,
                                            },
                                          };
                                        });
                                      }}/>
                                    </div>
                                    <div className=" flex flex-col gap-1">
                                      <Label>Cunning</Label>
                                      <Input type="number" min={0} max={100} step={0.00001} placeholder="Luck" value={val[27]} onChange={(e) => {
                                        let value = e.target.value;
                                        if(parseInt(value) > 100){
                                          value = "100";
                                        }

                                        setState((prev) => {
                                          if (!prev?.Member_now) return prev;
                                          const updatedValues = [...prev.Member_now.value];
                                          const val = [...updatedValues[index]];
                                          val[27] = value;
                                          updatedValues[index] = val;

                                          return {
                                            ...prev,
                                            Member_now: {
                                              ...prev.Member_now,
                                              value: updatedValues,
                                            },
                                          };
                                        });
                                      }}/>
                                    </div>
                                    <div className=" flex flex-col gap-1">
                                      <Label>Renown</Label>
                                      <Input type="number" min={0} max={100} step={0.00001} placeholder="Luck" value={val[16]} onChange={(e) => {
                                        let value = e.target.value;
                                        if(parseInt(value) > 100){
                                          value = "100";
                                        }

                                        setState((prev) => {
                                          if (!prev?.Member_now) return prev;
                                          const updatedValues = [...prev.Member_now.value];
                                          const val = [...updatedValues[index]];
                                          val[16] = value;
                                          updatedValues[index] = val;

                                          return {
                                            ...prev,
                                            Member_now: {
                                              ...prev.Member_now,
                                              value: updatedValues,
                                            },
                                          };
                                        });
                                      }}/>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })

                          return (
                            <div className=" grid grid-cols-1 lg:grid-cols-4 gap-4">{element}</div>
                          )
                        }

                        return (
                          <Alert variant="destructive">
                            <Terminal />
                            <AlertTitle>Missing key!</AlertTitle>
                          </Alert>
                        )
                      })()}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="Member_qu">
                    <AccordionTrigger>Spouse</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance">
                      {(() => {
                        if(state?.Member_qu){

                        }

                        return (
                          <Alert variant="destructive">
                            <Terminal />
                            <AlertTitle>Missing key!</AlertTitle>
                          </Alert>
                        )
                      })()}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="MenKe_Now">
                    <AccordionTrigger>Retainer</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance">
                      {(() => {
                        if(state?.MenKe_Now){

                        }

                        return (
                          <Alert variant="destructive">
                            <Terminal />
                            <AlertTitle>Missing key!</AlertTitle>
                          </Alert>
                        )
                      })()}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="misc">
                    <AccordionTrigger>Miscellaneous</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance">
                      
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

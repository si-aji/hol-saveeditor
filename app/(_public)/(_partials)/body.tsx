"use client"

import dynamic from 'next/dynamic';
import { ReactNode, useCallback, useEffect, useState } from "react";

// Icons
import { Loader2Icon, Terminal } from "lucide-react";

// Lib
import { indexMapping } from '@/lib/indexMapping';
import { inventoryItems } from '@/lib/inventoryItems';

// Partials

const FormClanMember = dynamic(() => import("./(_components)/form-clan_member"));
const FormClanSpouse = dynamic(() => import("./(_components)/form-clan_spouse"));
const FormClanRetainer = dynamic(() => import("./(_components)/form-clan_retainer"));

// Plugins
import VanillaJSONEditor from '@/components/plugins/vanilla-json-editor';

// Shadcn
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

type SaveData = {
	[key: string]: any; // biar tetap fleksibel untuk key lainnya
};

export default function Body() {
	const [state, setState] = useState<{
		es3: SaveData | null
		file: {
			name: string
			extension: string
		},
		processing: boolean,

		formState: 'member_now' | 'member_qu' | 'menke_now' | 'misc' | undefined,
	}>({
		es3: null,
		file: {
			name: '',
			extension: ''
		},
		processing: false,

		formState: undefined,
	});

	// File Upload
	const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setState(prev => ({...prev, es3: null, processing: true, file: {name: '', extension: ''}}))
		const file = event.target.files?.[0]
		if (!file) return

		// 1. Validate extension
		if (!file.name.toLowerCase().endsWith(".es3")) {
			toast.error("Invalid file format. Please upload a .es3 file.");
			return;
		}

		// 🔹 Get full filename
		const fullName = file.name;

		// 🔹 Split name and extension
		const dotIndex = fullName.lastIndexOf(".");
		const nameWithoutExtension = dotIndex !== -1 ? fullName.slice(0, dotIndex) : fullName;
		const extension = dotIndex !== -1 ? fullName.slice(dotIndex + 1) : "";

		const reader = new FileReader()
		reader.onload = (e) => {
			try {
				const text = reader.result as string;
				const jsonData = JSON.parse(text);

				const requiredKeys = ["Member_now", "Prop_have", "CGNum"];
				const missingKeys = requiredKeys.filter((key) => !(key in jsonData));

				if (missingKeys.length > 0) {
					toast.error(
						`Invalid game save file. Missing keys: ${missingKeys.join(", ")}`
					);
					return;
				}

				setState(prev => ({...prev, es3: jsonData, processing: false, file: {name: fullName, extension: extension}}))
			} catch (error) {
				toast.error("Invalid JSON format in the file.");
			}
		}

		reader.readAsText(file)
	}, []);

	useEffect(() => {
		console.log(state.es3);
	}, [state.es3])

	return (
		<div className=" flex flex-col gap-4 w-full h-full">
			<div className="">
				<Tabs defaultValue="form" className=" gap-10">
					<div className=" flex flex-row items-center gap-4">
						<Input type="file" onChange={handleFileChange} />

						<TabsList>
							<TabsTrigger value="json" disabled={state === null}>JSON</TabsTrigger>
							<TabsTrigger value="form" disabled={state === null}>Form</TabsTrigger>
						</TabsList>

						{/* Export */}
						<Button
							type="button"
							onClick={() => {
								const json = JSON.stringify(state.es3);
								const blob = new Blob([json], { type: "application/json" });
								const url = URL.createObjectURL(blob);

								const a = document.createElement("a");
								a.href = url;
								a.download = `${state.file.name}`;
								a.click();

								URL.revokeObjectURL(url);
							}}
							disabled={!state.es3 || !state.file.name || !state.file.extension}
						>
							Export
						</Button>
					</div>

					{/* JSON Editor */}
					<TabsContent value="json" className=" w-full h-2/3">
						<VanillaJSONEditor
							content={state.es3 ? { json: state.es3 } : { text: "" }}
							onChange={(content) => {
								if ("json" in content && content.json) {
									setState((prev) => ({
										...prev,
										es3: content.json as SaveData,
									}));
								}
							}}
						/>
					</TabsContent>

					{/* Form Editor */}
					<TabsContent value="form">
						<div className=" flex flex-col gap-4">
							<div className=" flex flex-col gap-4 border-b last:border-b-0 pb-4">
								{/* Header */}
								<div className=" flex flex-row items-center gap-4 justify-between cursor-pointer" onClick={() => setState(prev => ({...prev, formState: state.formState === 'member_now' ? undefined : 'member_now'}))}>
									{/* Title */}
									<div className=" flex flex-row items-center gap-2">
										<span>Clan Member</span>
										{state.es3 && "Member_now" in state.es3 && "value" in state.es3.Member_now && Array.isArray(state.es3.Member_now.value) && (
											<Badge>{state.es3.Member_now.value.length}</Badge>
										)}
									</div>

									{/* Icon */}
								</div>

								{/* Content */}
								<div hidden={state.formState !== 'member_now'}>
									<FormClanMember state={state} setState={setState}/>
								</div>
							</div>

							<div className=" flex flex-col gap-4 border-b last:border-b-0 pb-4">
								{/* Header */}
								<div className=" flex flex-row items-center gap-4 justify-between cursor-pointer" onClick={() => setState(prev => ({...prev, formState: state.formState === 'member_qu' ? undefined : 'member_qu'}))}>
									{/* Title */}
									<div className=" flex flex-row items-center gap-2">
										<span>Spouse</span>
										{state.es3 && "Member_qu" in state.es3 && "value" in state.es3.Member_qu && Array.isArray(state.es3.Member_qu.value) && (
											<Badge>{state.es3.Member_qu.value.length}</Badge>
										)}
									</div>

									{/* Icon */}
								</div>

								{/* Content */}
								<div hidden={state.formState !== 'member_qu'}>
									<FormClanSpouse state={state} setState={setState}/>
								</div>
							</div>

							<div className=" flex flex-col gap-4 border-b last:border-b-0 pb-4">
								{/* Header */}
								<div className=" flex flex-row items-center gap-4 justify-between cursor-pointer" onClick={() => setState(prev => ({...prev, formState: state.formState === 'menke_now' ? undefined : 'menke_now'}))}>
									{/* Title */}
									<div className=" flex flex-row items-center gap-2">
										<span>Retainer</span>
										{state.es3 && "MenKe_Now" in state.es3 && "value" in state.es3.MenKe_Now && Array.isArray(state.es3.MenKe_Now.value) && (
											<Badge>{state.es3.MenKe_Now.value.length}</Badge>
										)}
									</div>

									{/* Icon */}
								</div>

								{/* Content */}
								<div hidden={state.formState !== 'menke_now'}>
									<FormClanRetainer state={state} setState={setState}/>
								</div>
							</div>

							<div className=" flex flex-col gap-4 border-b last:border-b-0 pb-4">
								{/* Header */}
								<div className=" flex flex-row items-center gap-4 justify-between cursor-pointer" onClick={() => setState(prev => ({...prev, formState: state.formState === 'misc' ? undefined : 'misc'}))}>
									{/* Title */}
									<div className=" flex flex-row items-center gap-2">
										<span>Miscellaneous</span>
									</div>

									{/* Icon */}
								</div>

								{/* Content */}
								{state.formState === 'misc' && (
									<>
										{(() => {
											if (state.processing) {
												return (
													<div className=" font-semibold text-xl text-center flex flex-row gap-2 items-center justify-center">
														<Loader2Icon className=" animate-spin size-6" />
														<span>Loading</span>
													</div>
												);
											} else if (state.es3) {
												let element: ReactNode[] = [];
												if (state.es3?.CGNum?.value) {
													element.push(
														<div
															className=" flex flex-col lg:flex-row gap-4"
															key="game-currency"
														>
															<div className=" flex flex-col gap-1 w-4/12">
																<Label>Coin</Label>
																<Input
																	type="number"
																	min={0}
																	placeholder="Currency - Coin"
																	value={
																		state.es3.CGNum.value[indexMapping.CGNum.coin]
																	}
																	onChange={(e) => {
																		let value = e.target.value.toString();

																		setState((prev) => {
																			if (!prev.es3) return prev;

																			let CGNum = [...prev.es3.CGNum.value];
																			const data = [...CGNum]; // clone inner array/object to avoid mutation
																			data[indexMapping.CGNum.coin] = value;

																			return {
																				...prev,
																				es3: {
																					...prev.es3,
																					CGNum: {
																					...prev.es3.CGNum,
																					value: data,
																					},
																				},
																			};
																		});
																	}}
																/>
															</div>

															<div className=" flex flex-col gap-1 w-4/12">
																<Label>Gold</Label>
																<Input
																	type="number"
																	min={0}
																	placeholder="Currency - Gold"
																	value={
																		state.es3.CGNum.value[indexMapping.CGNum.gold]
																	}
																	onChange={(e) => {
																		let value = e.target.value.toString();

																		setState((prev) => {
																			if (!prev.es3) return prev;

																			let CGNum = [...prev.es3.CGNum.value];
																			const data = [...CGNum]; // clone inner array/object to avoid mutation
																			data[indexMapping.CGNum.gold] = value;

																			return {
																				...prev,
																				es3: {
																					...prev.es3,
																					CGNum: {
																					...prev.es3.CGNum,
																					value: data,
																					},
																				},
																			};
																		});
																	}}
																/>
															</div>

															<div className=" flex flex-col gap-1 w-4/12">
																<Label>Prisoner (Slave)</Label>
																<Input
																	type="number"
																	min={0}
																	placeholder="Currency - Prisoner / Slave"
																	value={state.es3.NuLiNum?.value ?? 0}
																	disabled={!state.es3.NuLiNum}
																	onChange={(e) => {
																		let value = e.target.value.toString();
																		if (parseInt(value) > 100) {
																			value = "100";
																		} else if (parseInt(value) < 0) {
																			value = "0";
																		}

																		setState((prev) => {
																			if (!prev.es3) return prev;

																			return {
																				...prev,
																				es3: {
																					...prev.es3,
																					NuLiNum: {
																					...prev.es3.NuLiNum,
																					value: value,
																					},
																				},
																			};
																		});
																	}}
																/>
															</div>
														</div>
													);
												}

												if (state.es3?.Prop_have && 'value' in state.es3.Prop_have) {
													const child: ReactNode = [
														...state.es3.Prop_have.value.map((val: any, index: number) => {
															const foundObject = inventoryItems.find((obj: any) =>
																obj.items.some((item: any) => item.id.toString() === val[indexMapping.Prop_have.item].toString())
															);

															return (
																<div
																	className="flex flex-row items-center gap-4 border rounded p-4"
																	key={`inventory-${index}`}
																>
																	<div className="flex flex-col gap-1 w-2/3">
																		<div className=' flex flex-row items-center gap-2'>
																			<Label>Item</Label>
																			{foundObject && <Badge>{foundObject.name}</Badge>}
																		</div>

																		<Select
																			value={val[indexMapping.Prop_have.item]}
																			onValueChange={(value) => {
																				setState((prev: any) => {
																					if (!prev.es3) return prev;
										
																					const Prop_have = [
																						...prev.es3.Prop_have.value,
																					];
																					const data = [...Prop_have[index]]; // clone inner array/object to avoid mutation
																					data[indexMapping.Prop_have.item] = value;
										
																					Prop_have[index] = data;
										
																					return {
																						...prev,
																						es3: {
																						...prev.es3,
																							Prop_have: {
																								...prev.es3.Prop_have,
																								value: Prop_have,
																							},
																						},
																					};
																				});
																			}}
																		>
																			<SelectTrigger className=' w-full'>
																				<SelectValue placeholder="Inventory Items" />
																			</SelectTrigger>
																			<SelectContent>
																				{inventoryItems.map((val, index) => {
																					return (
																						<SelectGroup key={`inventory_${index}-${val.key}`}>
																							<SelectLabel>{val.name}</SelectLabel>
																							{val.items.map((ch, index) => {
																								return <SelectItem value={ch.id.toString()} key={`inventory_${index}-${val.key}_${ch.id}`}>{ch.name}</SelectItem>
																							})}
																						</SelectGroup>
																					)
																				})}
																			</SelectContent>
																		</Select>
																	</div>
																	<div className="flex flex-col gap-1 w-1/3">
																		<Label>QTY</Label>
																		<Input
																			type="number"
																			min={0}
																			max={100}
																			placeholder="Item QTY"
																			value={val[indexMapping.Prop_have.qty]}
																			onChange={(e) => {
																				let value = e.target.value.toString();
																				if (parseInt(value) < 0) {
																					value = "0";
																				}
										
																				setState((prev: any) => {
																					if (!prev.es3) return prev;
										
																					const Prop_have = [
																						...prev.es3.Prop_have.value,
																					];
																					const data = [...Prop_have[index]]; // clone inner array/object to avoid mutation
																					data[indexMapping.Prop_have.qty] = value;
										
																					Prop_have[index] = data;
										
																					return {
																						...prev,
																						es3: {
																							...prev.es3,
																							Prop_have: {
																								...prev.es3.Prop_have,
																								value: Prop_have,
																							},
																						},
																					};
																				});
																			}}
																		/>
																	</div>
																</div>
															)
														}),


														<div
															className="flex flex-row items-center justify-center gap-4 border rounded p-4"
															key={`inventory-add_more`}
														>
															<Button type='button' onClick={() => {
																setState((prev: any) => {
																	if (!prev.es3) return prev;

																	const Prop_have = [...prev.es3.Prop_have.value];

																	// Define the structure of a new item (array or object)
																	const newItem = ["", ""];

																	Prop_have.push(newItem);

																	return {
																		...prev,
																		es3: {
																			...prev.es3,
																			Prop_have: {
																				...prev.es3.Prop_have,
																				value: Prop_have,
																			},
																		},
																	};
																});
															}}>Add more</Button>
														</div>
													];

													element.push(
														<Accordion
															type="single"
															collapsible
															className="w-full"
															key={`game-inventory`}
															defaultValue='inventory-items'
														>
															<AccordionItem value="inventory-items">
															<AccordionTrigger>
																Inventory Items
															</AccordionTrigger>
															<AccordionContent className="flex flex-col gap-4 text-balance">
																{(() => {
																	if (child) {
																		return (
																			<div className=" grid grid-cols-2 gap-4">{child}</div>
																		);
																	}

																	return <span>No data available</span>;
																})()}
															</AccordionContent>
															</AccordionItem>
														</Accordion>
													);
												}

												return (
													<div className=" flex flex-col gap-4">{element}</div>
												);
											}

											return (
												<Alert variant="destructive">
													<Terminal />
													<AlertTitle>Missing key!</AlertTitle>
												</Alert>
											);
										})()}
									</>
								)}
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}

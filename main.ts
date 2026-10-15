import { Plugin, WorkspaceLeaf } from "obsidian";
import { CheckInView, VIEW_TYPE_NURSERY_CHECKIN } from "./src/CheckInView";
import { NurseryStore } from "./src/store";

export default class NurseryCheckinPlugin extends Plugin {
	store!: NurseryStore;

	async onload(): Promise<void> {
		this.store = new NurseryStore(this.app);
		await this.store.ensureSetup();

		this.registerView(
			VIEW_TYPE_NURSERY_CHECKIN,
			(leaf: WorkspaceLeaf) => new CheckInView(leaf, this)
		);

		this.addRibbonIcon("baby", "Open Nursery Check-In", () => {
			this.activateView();
		});

		this.addCommand({
			id: "open-nursery-checkin",
			name: "Open check-in screen",
			callback: () => this.activateView(),
		});
	}

	onunload(): void {
		// Views are detached automatically by Obsidian.
	}

	private async activateView(): Promise<void> {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = workspace.getLeavesOfType(VIEW_TYPE_NURSERY_CHECKIN)[0] ?? null;

		if (!leaf) {
			leaf = workspace.getLeaf("tab");
			await leaf.setViewState({ type: VIEW_TYPE_NURSERY_CHECKIN, active: true });
		}

		workspace.revealLeaf(leaf);
	}
}

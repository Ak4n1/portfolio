import { Component, OnInit, inject, signal, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../../core/services/job.service';
import {
    JobOfferDto,
    ProfileSkillResponse,
    AlertRuleResponse,
    JobSearchRunResponse,
    SearchNowResponse
} from '../../../core/models/job.models';

@Component({
    selector: 'app-dashboard-ofertas',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './dashboard-ofertas.component.html',
    styleUrl: './dashboard-ofertas.component.css'
})
export class DashboardOfertasComponent implements OnInit {
    private jobService = inject(JobService);

    /* ---- State signals ---- */
    lastRun = signal<JobSearchRunResponse | null>(null);
    offers = signal<JobOfferDto[]>([]);
    skills = signal<ProfileSkillResponse[]>([]);
    rules = signal<AlertRuleResponse[]>([]);
    alertIntervalHours = signal<number>(24);
    filterCountry = signal<string>('');
    filterLanguage = signal<string>('');
    filterSource = signal<string>('');
    filterSourceOpen = signal(false);

    searching = signal(false);
    // ...

    // Helper to get label
    getFilterSourceLabel(): string {
        const current = this.filterSource();
        const found = this.sourceOptions.find(o => o.value === current);
        return found ? found.label : 'Todas las fuentes';
    }

    updateFilterSource(value: string): void {
        this.filterSource.set(value);
        if (value == "Adzuna") {
            this.filterCountry.set("us");
        } else if (value == "Jooble") {
            this.filterCountry.set("us");
        } else {
            this.filterCountry.set("");
        }
        this.saveSettings();
        console.log(value)
        console.log(this.filterCountry())
    }
    sendingEmail = signal(false);
    searchMessage = signal('');

    /* Skill form */
    newSkillName = '';
    newSkillCategory = '';
    editingSkillId: number | null = null;
    editSkillName = '';
    editSkillCategory = '';

    /* Rule form */
    newRuleName = '';
    newRuleKeywords = '';
    editingRuleId: number | null = null;
    editRuleName = '';
    editRuleKeywords = '';

    /* Interval options */
    intervalOptions = [
        { label: '6 horas', value: 6 },
        { label: '12 horas', value: 12 },
        { label: '24 horas', value: 24 },
        { label: '48 horas', value: 48 }
    ];

    /* Options for selectors */
    languageOptions = [
        { value: '', label: 'Sin filtro' },
        { value: 'es', label: 'Español' },
        { value: 'en', label: 'Inglés' },
        { value: 'pt', label: 'Portugués' }
    ];

    sourceOptions = [
        { value: '', label: 'Todas las fuentes' },
        { value: 'RemoteOK', label: 'RemoteOK (Global)' },
        { value: 'Adzuna', label: 'Adzuna US' },
        { value: 'Arbeitnow', label: 'Arbeitnow (Europa/Remoto)' },
        { value: 'Remotewx', label: 'Remotewx (Remoto)' },
        { value: 'Findwork', label: 'Findwork (Dev)' },
        { value: 'Jooble', label: 'Jooble US' }
    ];

    ngOnInit(): void {
        this.loadAll();
    }

    loadAll(): void {
        this.jobService.getLastRun().subscribe({
            next: run => this.lastRun.set(run),
            error: () => this.lastRun.set(null)
        });
        this.jobService.listSkills().subscribe({
            next: list => this.skills.set(list),
            error: () => this.skills.set([])
        });
        this.jobService.listRules().subscribe({
            next: list => this.rules.set(list),
            error: () => this.rules.set([])
        });
        this.jobService.getSettings().subscribe({
            next: s => {
                this.alertIntervalHours.set(s.alertIntervalHours);
                this.filterCountry.set(s.filterCountry || '');
                this.filterLanguage.set(s.filterLanguage || '');
                this.filterSource.set(s.filterSource || ''); // Load source
            },
            error: () => { }
        });
    }

    /* ==================== Search ==================== */

    searchNow(): void {
        this.searching.set(true);
        this.searchMessage.set('');
        this.jobService.searchNow().subscribe({
            next: (res: SearchNowResponse) => {
                this.searching.set(false);
                this.searchMessage.set(res.message);
                this.offers.set(res.offers);
                // Refresh last run
                this.jobService.getLastRun().subscribe({
                    next: run => this.lastRun.set(run),
                    error: () => { }
                });
                console.log(this.getSkillsNames)
            },
            error: (err) => {
                this.searching.set(false);
                this.searchMessage.set('Error al buscar ofertas: ' + (err.error?.message || err.message || 'Error desconocido'));
            }
        });
    }

    /* ==================== Skills CRUD ==================== */

    addSkill(): void {
        if (!this.newSkillName.trim()) return;
        this.jobService.createSkill({
            name: this.newSkillName.trim(),
            category: this.newSkillCategory.trim() || null
        }).subscribe({
            next: () => {
                this.newSkillName = '';
                this.newSkillCategory = '';
                this.jobService.listSkills().subscribe(list => this.skills.set(list));
            }
        });
    }

    startEditSkill(skill: ProfileSkillResponse): void {
        this.editingSkillId = skill.id;
        this.editSkillName = skill.name;
        this.editSkillCategory = skill.category || '';
    }

    saveEditSkill(): void {
        if (this.editingSkillId === null || !this.editSkillName.trim()) return;
        this.jobService.updateSkill(this.editingSkillId, {
            name: this.editSkillName.trim(),
            category: this.editSkillCategory.trim() || null
        }).subscribe({
            next: () => {
                this.editingSkillId = null;
                this.jobService.listSkills().subscribe(list => this.skills.set(list));
            }
        });
    }

    cancelEditSkill(): void {
        this.editingSkillId = null;
    }

    deleteSkill(id: number): void {
        this.jobService.deleteSkill(id).subscribe({
            next: () => this.jobService.listSkills().subscribe(list => this.skills.set(list))
        });
    }

    /* ==================== Rules CRUD ==================== */

    addRule(): void {
        if (!this.newRuleName.trim() || !this.newRuleKeywords.trim()) return;
        const keywords = this.newRuleKeywords.split(',').map(k => k.trim()).filter(k => k);
        if (!keywords.length) return;
        this.jobService.createRule({
            name: this.newRuleName.trim(),
            active: true,
            keywords
        }).subscribe({
            next: () => {
                this.newRuleName = '';
                this.newRuleKeywords = '';
                this.jobService.listRules().subscribe(list => this.rules.set(list));
            }
        });
    }

    startEditRule(rule: AlertRuleResponse): void {
        this.editingRuleId = rule.id;
        this.editRuleName = rule.name;
        this.editRuleKeywords = rule.keywords.join(', ');
    }

    saveEditRule(): void {
        if (this.editingRuleId === null || !this.editRuleName.trim()) return;
        const keywords = this.editRuleKeywords.split(',').map(k => k.trim()).filter(k => k);
        if (!keywords.length) return;
        const rule = this.rules().find(r => r.id === this.editingRuleId);
        this.jobService.updateRule(this.editingRuleId, {
            name: this.editRuleName.trim(),
            active: rule?.active ?? true,
            keywords
        }).subscribe({
            next: () => {
                this.editingRuleId = null;
                this.jobService.listRules().subscribe(list => this.rules.set(list));
            }
        });
    }

    cancelEditRule(): void {
        this.editingRuleId = null;
    }

    toggleRuleActive(rule: AlertRuleResponse): void {
        this.jobService.updateRule(rule.id, {
            name: rule.name,
            active: !rule.active,
            keywords: rule.keywords
        }).subscribe({
            next: () => this.jobService.listRules().subscribe(list => this.rules.set(list))
        });
    }

    deleteRule(id: number): void {
        this.jobService.deleteRule(id).subscribe({
            next: () => this.jobService.listRules().subscribe(list => this.rules.set(list))
        });
    }

    /* ==================== Settings ==================== */

    updateInterval(hours: number): void {
        this.alertIntervalHours.set(hours);
        this.saveSettings();
    }

    updateFilterCountry(value: string): void {
        this.filterCountry.set(value);
        this.saveSettings();
    }

    updateFilterLanguage(value: string): void {
        this.filterLanguage.set(value);
        this.saveSettings();
    }



    private saveSettings(): void {
        this.jobService.updateSettings({
            alertIntervalHours: this.alertIntervalHours(),
            filterCountry: this.filterCountry() || undefined,
            filterLanguage: this.filterLanguage() || undefined,
            filterSource: this.filterSource() || undefined
        }).subscribe({
            next: s => {
                this.alertIntervalHours.set(s.alertIntervalHours);
                this.filterCountry.set(s.filterCountry || '');
                this.filterLanguage.set(s.filterLanguage || '');
                this.filterSource.set(s.filterSource || '');
            }
        });
    }

    /* ==================== Email ==================== */

    sendEmail(): void {
        this.sendingEmail.set(true);
        this.searchMessage.set('');
        this.jobService.sendEmail().subscribe({
            next: (res: SearchNowResponse) => {
                this.sendingEmail.set(false);
                this.searchMessage.set(res.message);
            },
            error: (err) => {
                this.sendingEmail.set(false);
                this.searchMessage.set('Error al enviar email: ' + (err.error?.message || err.message || 'Error desconocido'));
            }
        });
    }



    /* ==================== Helpers ==================== */

    formatDate(dateStr: string | null): string {
        if (!dateStr) return '—';
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString('es-AR', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
        } catch {
            return dateStr;
        }
    }

    timeSince(dateStr: string | null): string {
        if (!dateStr) return '';
        const now = new Date();
        const then = new Date(dateStr);
        const diffMs = now.getTime() - then.getTime();
        const diffMin = Math.floor(diffMs / 60000);
        if (diffMin < 1) return 'hace un momento';
        if (diffMin < 60) return `hace ${diffMin} min`;
        const diffH = Math.floor(diffMin / 60);
        if (diffH < 24) return `hace ${diffH}h`;
        const diffD = Math.floor(diffH / 24);
        return `hace ${diffD}d`;
    }

    private elementRef = inject(ElementRef);

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        const target = event.target as Node;
        const el = this.elementRef.nativeElement as HTMLElement;
        const selectEl = el.querySelector('.custom-select');

        // Close if click is outside the custom select
        if (selectEl && !selectEl.contains(target)) {
            this.filterSourceOpen.set(false);
        }
    }

    getSkillsNames(): string {
        const names = this.skills().map(skill => skill.name).join(', ');
        console.log('Skills:', names);
        return names;
    }
}

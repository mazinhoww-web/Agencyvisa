import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

const FORM_STEPS = [
  { id: 1, title: 'Dados pessoais', description: 'Nome, data de nascimento, estado civil' },
  { id: 2, title: 'Informações de contato', description: 'Endereço, telefone, e-mail' },
  { id: 3, title: 'Passaporte', description: 'Tipo, número, validade' },
  { id: 4, title: 'Viagem', description: 'Propósito, datas, endereço nos EUA' },
  { id: 5, title: 'Situação profissional', description: 'Emprego, renda, educação' },
  { id: 6, title: 'Família', description: 'Pais, cônjuge, filhos' },
  { id: 7, title: 'Viagens anteriores', description: 'Histórico de viagens e vistos' },
  { id: 8, title: 'Questões de segurança', description: 'Perguntas obrigatórias do DS-160' },
]

const UF_OPTIONS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'
]

type FormData = {
  surname: string; given_name: string; other_names: string; gender: string; marital_status: string
  birth_date: string; birth_city: string; birth_state: string; birth_country: string
  address_street: string; address_number: string; address_complement: string; address_neighborhood: string
  address_city: string; address_state: string; address_zip: string; phone_residential: string; phone_mobile: string; email: string
  passport_type: string; passport_number: string; passport_country: string; passport_issue_date: string; passport_expiry_date: string
  travel_purpose: string; intended_arrival_date: string; intended_stay_duration: string; us_address: string; trip_payer: string
  emp_employer: string; emp_job_title: string; emp_salary: string; emp_employed_since: string; emp_employer_address: string; emp_currently_employed: boolean
  edu_last_school: string; edu_field_of_study: string; edu_graduation_year: string; edu_education_level: string
  fam_father_name: string; fam_father_birthdate: string; fam_father_birthplace: string; fam_father_nationality: string
  fam_mother_name: string; fam_mother_birthdate: string; fam_mother_birthplace: string; fam_mother_nationality: string
  fam_has_spouse: boolean; fam_spouse_name: string; fam_has_children: boolean
  prev_visited_before: boolean; prev_last_visit_date: string; prev_visa_refused: boolean; prev_refused_reason: string
  prev_visa_cancelled: boolean; prev_cancel_reason: string; prev_overstayed: boolean
  sec_q1: boolean | null; sec_q1_details: string; sec_q2: boolean | null; sec_q2_details: string
  sec_q3: boolean | null; sec_q3_details: string; sec_q4: boolean | null; sec_q4_details: string
  sec_q5: boolean | null; sec_q5_details: string; sec_q6: boolean | null; sec_q6_details: string
  sec_q7: boolean | null; sec_q7_details: string; sec_q8: boolean | null; sec_q8_details: string
}

const defaultFormData: FormData = {
  surname: '', given_name: '', other_names: '', gender: '', marital_status: '',
  birth_date: '', birth_city: '', birth_state: '', birth_country: '',
  address_street: '', address_number: '', address_complement: '', address_neighborhood: '',
  address_city: '', address_state: '', address_zip: '', phone_residential: '', phone_mobile: '', email: '',
  passport_type: '', passport_number: '', passport_country: 'Brasil', passport_issue_date: '', passport_expiry_date: '',
  travel_purpose: '', intended_arrival_date: '', intended_stay_duration: '', us_address: '', trip_payer: '',
  emp_employer: '', emp_job_title: '', emp_salary: '', emp_employed_since: '', emp_employer_address: '',
  emp_currently_employed: true,
  edu_last_school: '', edu_field_of_study: '', edu_graduation_year: '', edu_education_level: '',
  fam_father_name: '', fam_father_birthdate: '', fam_father_birthplace: '', fam_father_nationality: 'Brasileira',
  fam_mother_name: '', fam_mother_birthdate: '', fam_mother_birthplace: '', fam_mother_nationality: 'Brasileira',
  fam_has_spouse: false, fam_spouse_name: '',
  fam_has_children: false,
  prev_visited_before: false, prev_last_visit_date: '', prev_visa_refused: false, prev_refused_reason: '',
  prev_visa_cancelled: false, prev_cancel_reason: '', prev_overstayed: false,
  sec_q1: null, sec_q1_details: '', sec_q2: null, sec_q2_details: '',
  sec_q3: null, sec_q3_details: '', sec_q4: null, sec_q4_details: '',
  sec_q5: null, sec_q5_details: '', sec_q6: null, sec_q6_details: '',
  sec_q7: null, sec_q7_details: '', sec_q8: null, sec_q8_details: '',
}

const SECURITY_QUESTIONS = [
  'Você possui ou já possuiu alguma doença transmissível?',
  'Você possui algum problema mental ou físico que possa representar risco?',
  'Você já foi preso, condenado ou esteve envolvido em atividades ilegais?',
  'Você já violou condições de visto ou leis de imigração?',
  'Você já esteve envolvido em espionagem, sabotagem ou terrorismo?',
  'Você pretende praticar trabalho ilegal nos EUA?',
  'Você já solicitou assistência governamental nos EUA?',
  'Você já removido ou deportado dos EUA?',
]

const Formulario = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(defaultFormData)
  const [applicantId, setApplicantId] = useState<string | null>(null)
  const [processId, setProcessId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const progress = ((currentStep - 1) / (FORM_STEPS.length - 1)) * 100

  const updateField = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }, [])

  // Load existing applicant data
  useEffect(() => {
    const loadApplicant = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setLoading(false); return }

        const { data: proc } = await supabase
          .from('processes')
          .select('id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (!proc) { setLoading(false); return }
        setProcessId(proc.id)

        const { data: applicant } = await supabase
          .from('applicants')
          .select('*')
          .eq('process_id', proc.id)
          .eq('is_primary', true)
          .maybeSingle()

        if (!applicant) { setLoading(false); return }
        setApplicantId(applicant.id)

        // Populate form
        const merged: Partial<FormData> = {
          surname: applicant.surname || '', given_name: applicant.given_name || '',
          other_names: applicant.other_names || '', gender: applicant.gender || '',
          marital_status: applicant.marital_status || '', birth_date: applicant.birth_date || '',
          birth_city: applicant.birth_city || '', birth_state: applicant.birth_state || '',
          birth_country: applicant.birth_country || '',
          address_street: applicant.address_street || '', address_number: applicant.address_number || '',
          address_complement: applicant.address_complement || '', address_neighborhood: applicant.address_neighborhood || '',
          address_city: applicant.address_city || '', address_state: applicant.address_state || '',
          address_zip: applicant.address_zip || '', phone_residential: applicant.phone_residential || '',
          phone_mobile: applicant.phone_mobile || '', email: applicant.email || '',
          passport_type: applicant.passport_type || '', passport_number: applicant.passport_number || '',
          passport_country: applicant.passport_country || 'Brasil',
          passport_issue_date: applicant.passport_issue_date || '', passport_expiry_date: applicant.passport_expiry_date || '',
          travel_purpose: applicant.travel_purpose || '', intended_arrival_date: applicant.intended_arrival_date || '',
          intended_stay_duration: applicant.intended_stay_duration || '', us_address: applicant.us_address || '',
          trip_payer: applicant.trip_payer || '',
        }

        // Employment
        const emp = (applicant.employment_data as Record<string, unknown>) || {}
        merged.emp_employer = (emp.employer as string) || ''
        merged.emp_job_title = (emp.job_title as string) || ''
        merged.emp_salary = (emp.salary as string) || ''
        merged.emp_employed_since = (emp.employed_since as string) || ''
        merged.emp_employer_address = (emp.employer_address as string) || ''
        merged.emp_currently_employed = emp.currently_employed !== undefined ? emp.currently_employed as boolean : true

        // Education
        const edu = (applicant.education_data as Record<string, unknown>) || {}
        merged.edu_last_school = (edu.last_school as string) || ''
        merged.edu_field_of_study = (edu.field_of_study as string) || ''
        merged.edu_graduation_year = (edu.graduation_year as string) || ''
        merged.edu_education_level = (edu.education_level as string) || ''

        // Family
        const fam = (applicant.family_data as Record<string, unknown>) || {}
        merged.fam_father_name = (fam.father_name as string) || ''
        merged.fam_father_birthdate = (fam.father_birthdate as string) || ''
        merged.fam_father_birthplace = (fam.father_birthplace as string) || ''
        merged.fam_father_nationality = (fam.father_nationality as string) || 'Brasileira'
        merged.fam_mother_name = (fam.mother_name as string) || ''
        merged.fam_mother_birthdate = (fam.mother_birthdate as string) || ''
        merged.fam_mother_birthplace = (fam.mother_birthplace as string) || ''
        merged.fam_mother_nationality = (fam.mother_nationality as string) || 'Brasileira'
        merged.fam_has_spouse = (fam.has_spouse as boolean) || false
        merged.fam_spouse_name = (fam.spouse_name as string) || ''
        merged.fam_has_children = (fam.has_children as boolean) || false

        // Previous travel
        const prev = (applicant.previous_us_travel as Record<string, unknown>) || {}
        merged.prev_visited_before = (prev.visited_before as boolean) || false
        merged.prev_last_visit_date = (prev.last_visit_date as string) || ''
        merged.prev_visa_refused = (prev.visa_refused as boolean) || false
        merged.prev_refused_reason = (prev.refused_reason as string) || ''
        merged.prev_visa_cancelled = (prev.visa_cancelled as boolean) || false
        merged.prev_cancel_reason = (prev.cancel_reason as string) || ''
        merged.prev_overstayed = (prev.overstayed as boolean) || false

        // Security
        const sec = (applicant.security_questions as Record<string, unknown>) || {}
        for (let i = 1; i <= 8; i++) {
          (merged as Record<string, unknown>)[`sec_q${i}`] = sec[`q${i}`] !== undefined ? sec[`q${i}`] : null;
          (merged as Record<string, unknown>)[`sec_q${i}_details`] = (sec[`q${i}_details`] as string) || ''
        }

        setFormData((p) => ({ ...p, ...merged }))

        if (applicant.form_step && applicant.form_step > 1) {
          setCurrentStep(Math.min(applicant.form_step, FORM_STEPS.length))
        }
      } catch (err) {
        console.error('Error loading applicant:', err)
      } finally {
        setLoading(false)
      }
    }

    loadApplicant()
  }, [])

  const buildStepPayload = (step: number): Record<string, unknown> => {
    switch (step) {
      case 1: return {
        surname: formData.surname, given_name: formData.given_name, other_names: formData.other_names,
        gender: formData.gender, marital_status: formData.marital_status, birth_date: formData.birth_date || null,
        birth_city: formData.birth_city, birth_state: formData.birth_state, birth_country: formData.birth_country,
        form_step: 1,
      }
      case 2: return {
        address_street: formData.address_street, address_number: formData.address_number,
        address_complement: formData.address_complement, address_neighborhood: formData.address_neighborhood,
        address_city: formData.address_city, address_state: formData.address_state, address_zip: formData.address_zip,
        phone_residential: formData.phone_residential, phone_mobile: formData.phone_mobile, email: formData.email,
        form_step: 2,
      }
      case 3: return {
        passport_type: formData.passport_type, passport_number: formData.passport_number,
        passport_country: formData.passport_country,
        passport_issue_date: formData.passport_issue_date || null, passport_expiry_date: formData.passport_expiry_date || null,
        form_step: 3,
      }
      case 4: return {
        travel_purpose: formData.travel_purpose, intended_arrival_date: formData.intended_arrival_date || null,
        intended_stay_duration: formData.intended_stay_duration, us_address: formData.us_address,
        trip_payer: formData.trip_payer, form_step: 4,
      }
      case 5: return {
        employment_data: {
          employer: formData.emp_employer, job_title: formData.emp_job_title, salary: formData.emp_salary,
          employed_since: formData.emp_employed_since, employer_address: formData.emp_employer_address,
          currently_employed: formData.emp_currently_employed,
        },
        education_data: {
          last_school: formData.edu_last_school, field_of_study: formData.edu_field_of_study,
          graduation_year: formData.edu_graduation_year, education_level: formData.edu_education_level,
        },
        form_step: 5,
      }
      case 6: return {
        family_data: {
          father_name: formData.fam_father_name, father_birthdate: formData.fam_father_birthdate,
          father_birthplace: formData.fam_father_birthplace, father_nationality: formData.fam_father_nationality,
          mother_name: formData.fam_mother_name, mother_birthdate: formData.fam_mother_birthdate,
          mother_birthplace: formData.fam_mother_birthplace, mother_nationality: formData.fam_mother_nationality,
          has_spouse: formData.fam_has_spouse, spouse_name: formData.fam_has_spouse ? formData.fam_spouse_name : '',
          has_children: formData.fam_has_children,
        },
        form_step: 6,
      }
      case 7: return {
        previous_us_travel: {
          visited_before: formData.prev_visited_before,
          last_visit_date: formData.prev_visited_before ? formData.prev_last_visit_date : '',
          visa_refused: formData.prev_visa_refused,
          refused_reason: formData.prev_visa_refused ? formData.prev_refused_reason : '',
          visa_cancelled: formData.prev_visa_cancelled,
          cancel_reason: formData.prev_visa_cancelled ? formData.prev_cancel_reason : '',
          overstayed: formData.prev_overstayed,
        },
        form_step: 7,
      }
      case 8: return {
        security_questions: Object.fromEntries(
          Array.from({ length: 8 }, (_, i) => {
            const n = i + 1
            const val = formData[`sec_q${n}` as keyof FormData]
            return [
              [`q${n}`, val],
              [`q${n}_details`, val ? formData[`sec_q${n}_details` as keyof FormData] : ''],
            ]
          }).flat()
        ),
        form_step: 8,
        form_completed_at: new Date().toISOString(),
      }
      default: return {}
    }
  }

  const saveStep = async (step: number): Promise<boolean> => {
    if (!applicantId) return true
    setSaving(true)
    setSaveError(null)
    try {
      const payload = buildStepPayload(step)
      const { error } = await supabase
        .from('applicants')
        .update(payload)
        .eq('id', applicantId)

      if (error) throw error
      toast.success('Etapa salva com sucesso!')
      return true
    } catch (err) {
      console.error('Save error:', err)
      setSaveError('Erro ao salvar. Verifique sua conexão e tente novamente.')
      return false
    } finally {
      setSaving(false)
    }
  }

  const handleNext = async () => {
    const saved = await saveStep(currentStep)
    if (!saved) return

    if (currentStep === FORM_STEPS.length) {
      if (processId) {
        await supabase.from('processes').update({ status: 'form_completed' }).eq('id', processId)
      }
      toast.success('Formulário enviado com sucesso!')
      navigate('/dashboard')
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleSaveDraft = async () => {
    await saveStep(currentStep)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Carregando formulário...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <span>/</span>
          <span>Formulário DS-160</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground">Formulário DS-160</h1>
        <p className="text-muted-foreground mt-1">Preencha com calma — você pode salvar e continuar depois.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-sm font-semibold">Etapas</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {FORM_STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  step.id === currentStep ? 'bg-primary/10 text-primary font-medium'
                    : step.id < currentStep ? 'text-success' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <span className="font-mono mr-2">{step.id}.</span>{step.title}
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Etapa {currentStep} de {FORM_STEPS.length}: {FORM_STEPS[currentStep - 1].title}</span>
                <span className="text-muted-foreground">{Math.round(progress)}% completo</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground">{FORM_STEPS[currentStep - 1].description}</p>
            </div>
          </CardHeader>
          <CardContent>
            {saveError && (
              <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4" />
                {saveError}
              </div>
            )}

            {/* STEP 1 */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-bold">Dados pessoais</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Sobrenome (como no passaporte) *</Label>
                    <Input value={formData.surname} onChange={(e) => updateField('surname', e.target.value)} placeholder="SILVA" />
                  </div>
                  <div className="space-y-2">
                    <Label>Nome(s) (como no passaporte) *</Label>
                    <Input value={formData.given_name} onChange={(e) => updateField('given_name', e.target.value)} placeholder="JOAO CARLOS" />
                  </div>
                  <div className="space-y-2">
                    <Label>Outros nomes (apelido, nome anterior)</Label>
                    <Input value={formData.other_names} onChange={(e) => updateField('other_names', e.target.value)} placeholder="Opcional" />
                  </div>
                  <div className="space-y-2">
                    <Label>Data de nascimento *</Label>
                    <Input type="date" value={formData.birth_date} onChange={(e) => updateField('birth_date', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Sexo *</Label>
                    <Select value={formData.gender} onValueChange={(v) => updateField('gender', v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Masculino</SelectItem>
                        <SelectItem value="female">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Estado civil *</Label>
                    <Select value={formData.marital_status} onValueChange={(v) => updateField('marital_status', v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Solteiro(a)</SelectItem>
                        <SelectItem value="married">Casado(a)</SelectItem>
                        <SelectItem value="divorced">Divorciado(a)</SelectItem>
                        <SelectItem value="widowed">Viúvo(a)</SelectItem>
                        <SelectItem value="common_law">União estável</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>País de nascimento *</Label>
                    <Input value={formData.birth_country} onChange={(e) => updateField('birth_country', e.target.value)} placeholder="Brasil" />
                  </div>
                  <div className="space-y-2">
                    <Label>Cidade de nascimento *</Label>
                    <Input value={formData.birth_city} onChange={(e) => updateField('birth_city', e.target.value)} placeholder="São Paulo" />
                  </div>
                  <div className="space-y-2">
                    <Label>Estado de nascimento</Label>
                    <Select value={formData.birth_state} onValueChange={(v) => updateField('birth_state', v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {UF_OPTIONS.map(uf => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-bold">Informações de contato</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Logradouro *</Label><Input value={formData.address_street} onChange={(e) => updateField('address_street', e.target.value)} placeholder="Rua das Flores" /></div>
                  <div className="space-y-2"><Label>Número *</Label><Input value={formData.address_number} onChange={(e) => updateField('address_number', e.target.value)} placeholder="123" /></div>
                  <div className="space-y-2"><Label>Complemento</Label><Input value={formData.address_complement} onChange={(e) => updateField('address_complement', e.target.value)} placeholder="Apto 45" /></div>
                  <div className="space-y-2"><Label>Bairro *</Label><Input value={formData.address_neighborhood} onChange={(e) => updateField('address_neighborhood', e.target.value)} placeholder="Centro" /></div>
                  <div className="space-y-2"><Label>Cidade *</Label><Input value={formData.address_city} onChange={(e) => updateField('address_city', e.target.value)} placeholder="São Paulo" /></div>
                  <div className="space-y-2">
                    <Label>Estado (UF) *</Label>
                    <Select value={formData.address_state} onValueChange={(v) => updateField('address_state', v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>{UF_OPTIONS.map(uf => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>CEP *</Label><Input value={formData.address_zip} onChange={(e) => updateField('address_zip', e.target.value)} placeholder="01310-100" /></div>
                  <div className="space-y-2"><Label>Telefone residencial</Label><Input value={formData.phone_residential} onChange={(e) => updateField('phone_residential', e.target.value)} placeholder="(11) 3456-7890" /></div>
                  <div className="space-y-2"><Label>Celular *</Label><Input value={formData.phone_mobile} onChange={(e) => updateField('phone_mobile', e.target.value)} placeholder="(11) 98765-4321" /></div>
                  <div className="space-y-2"><Label>E-mail *</Label><Input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} placeholder="joao@email.com" /></div>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-bold">Passaporte</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de passaporte *</Label>
                    <Select value={formData.passport_type} onValueChange={(v) => updateField('passport_type', v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="diplomatic">Diplomático</SelectItem>
                        <SelectItem value="official">Oficial</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Número do passaporte *</Label><Input value={formData.passport_number} onChange={(e) => updateField('passport_number', e.target.value.toUpperCase())} placeholder="AA123456" /></div>
                  <div className="space-y-2"><Label>País emissor *</Label><Input value={formData.passport_country} onChange={(e) => updateField('passport_country', e.target.value)} placeholder="Brasil" /></div>
                  <div className="space-y-2"><Label>Data de emissão *</Label><Input type="date" value={formData.passport_issue_date} onChange={(e) => updateField('passport_issue_date', e.target.value)} /></div>
                  <div className="space-y-2"><Label>Data de validade *</Label><Input type="date" value={formData.passport_expiry_date} onChange={(e) => updateField('passport_expiry_date', e.target.value)} /></div>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-bold">Informações da viagem</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Propósito da viagem *</Label>
                    <Select value={formData.travel_purpose} onValueChange={(v) => updateField('travel_purpose', v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tourism">Turismo</SelectItem>
                        <SelectItem value="business">Negócios</SelectItem>
                        <SelectItem value="study">Estudo</SelectItem>
                        <SelectItem value="medical">Tratamento médico</SelectItem>
                        <SelectItem value="transit">Trânsito</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Data pretendida de chegada</Label><Input type="date" value={formData.intended_arrival_date} onChange={(e) => updateField('intended_arrival_date', e.target.value)} /></div>
                  <div className="space-y-2"><Label>Duração pretendida da estadia</Label><Input value={formData.intended_stay_duration} onChange={(e) => updateField('intended_stay_duration', e.target.value)} placeholder="Ex: 30 dias" /></div>
                  <div className="space-y-2 md:col-span-2"><Label>Endereço nos EUA onde ficará *</Label><Textarea value={formData.us_address} onChange={(e) => updateField('us_address', e.target.value)} placeholder="Hotel, endereço de familiar, etc." /></div>
                  <div className="space-y-2"><Label>Quem pagará a viagem?</Label><Input value={formData.trip_payer} onChange={(e) => updateField('trip_payer', e.target.value)} placeholder="Próprio, empresa, familiar..." /></div>
                </div>
              </div>
            )}

            {/* STEP 5 */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="font-display text-xl font-bold">Situação profissional</h2>
                  <div className="flex items-center gap-2">
                    <Checkbox checked={formData.emp_currently_employed} onCheckedChange={(v) => updateField('emp_currently_employed', !!v)} />
                    <Label>Empregado(a) atualmente</Label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Empregador</Label><Input value={formData.emp_employer} onChange={(e) => updateField('emp_employer', e.target.value)} /></div>
                    <div className="space-y-2"><Label>Cargo</Label><Input value={formData.emp_job_title} onChange={(e) => updateField('emp_job_title', e.target.value)} /></div>
                    <div className="space-y-2"><Label>Salário mensal (R$)</Label><Input value={formData.emp_salary} onChange={(e) => updateField('emp_salary', e.target.value)} /></div>
                    <div className="space-y-2"><Label>Empregado desde</Label><Input type="date" value={formData.emp_employed_since} onChange={(e) => updateField('emp_employed_since', e.target.value)} /></div>
                    <div className="space-y-2 md:col-span-2"><Label>Endereço do empregador</Label><Input value={formData.emp_employer_address} onChange={(e) => updateField('emp_employer_address', e.target.value)} /></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h2 className="font-display text-xl font-bold">Educação</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nível de escolaridade</Label>
                      <Select value={formData.edu_education_level} onValueChange={(v) => updateField('edu_education_level', v)}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fundamental">Ensino Fundamental</SelectItem>
                          <SelectItem value="medio">Ensino Médio</SelectItem>
                          <SelectItem value="tecnico">Técnico</SelectItem>
                          <SelectItem value="superior">Superior</SelectItem>
                          <SelectItem value="pos">Pós-graduação</SelectItem>
                          <SelectItem value="mestrado">Mestrado</SelectItem>
                          <SelectItem value="doutorado">Doutorado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2"><Label>Última escola/universidade</Label><Input value={formData.edu_last_school} onChange={(e) => updateField('edu_last_school', e.target.value)} /></div>
                    <div className="space-y-2"><Label>Área de estudo</Label><Input value={formData.edu_field_of_study} onChange={(e) => updateField('edu_field_of_study', e.target.value)} /></div>
                    <div className="space-y-2"><Label>Ano de conclusão</Label><Input value={formData.edu_graduation_year} onChange={(e) => updateField('edu_graduation_year', e.target.value)} placeholder="2020" /></div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6 */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <h2 className="font-display text-xl font-bold">Família</h2>
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Pai</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Nome completo</Label><Input value={formData.fam_father_name} onChange={(e) => updateField('fam_father_name', e.target.value)} /></div>
                    <div className="space-y-2"><Label>Data de nascimento</Label><Input type="date" value={formData.fam_father_birthdate} onChange={(e) => updateField('fam_father_birthdate', e.target.value)} /></div>
                    <div className="space-y-2"><Label>Local de nascimento</Label><Input value={formData.fam_father_birthplace} onChange={(e) => updateField('fam_father_birthplace', e.target.value)} /></div>
                    <div className="space-y-2"><Label>Nacionalidade</Label><Input value={formData.fam_father_nationality} onChange={(e) => updateField('fam_father_nationality', e.target.value)} /></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Mãe</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Nome completo</Label><Input value={formData.fam_mother_name} onChange={(e) => updateField('fam_mother_name', e.target.value)} /></div>
                    <div className="space-y-2"><Label>Data de nascimento</Label><Input type="date" value={formData.fam_mother_birthdate} onChange={(e) => updateField('fam_mother_birthdate', e.target.value)} /></div>
                    <div className="space-y-2"><Label>Local de nascimento</Label><Input value={formData.fam_mother_birthplace} onChange={(e) => updateField('fam_mother_birthplace', e.target.value)} /></div>
                    <div className="space-y-2"><Label>Nacionalidade</Label><Input value={formData.fam_mother_nationality} onChange={(e) => updateField('fam_mother_nationality', e.target.value)} /></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Checkbox checked={formData.fam_has_spouse} onCheckedChange={(v) => updateField('fam_has_spouse', !!v)} />
                    <Label>Possui cônjuge?</Label>
                  </div>
                  {formData.fam_has_spouse && (
                    <div className="space-y-2"><Label>Nome do cônjuge</Label><Input value={formData.fam_spouse_name} onChange={(e) => updateField('fam_spouse_name', e.target.value)} /></div>
                  )}
                  <div className="flex items-center gap-2">
                    <Checkbox checked={formData.fam_has_children} onCheckedChange={(v) => updateField('fam_has_children', !!v)} />
                    <Label>Possui filhos?</Label>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7 */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <h2 className="font-display text-xl font-bold">Viagens anteriores</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Checkbox checked={formData.prev_visited_before} onCheckedChange={(v) => updateField('prev_visited_before', !!v)} />
                    <Label>Já visitou os EUA anteriormente?</Label>
                  </div>
                  {formData.prev_visited_before && (
                    <div className="space-y-2"><Label>Data da última visita</Label><Input type="date" value={formData.prev_last_visit_date} onChange={(e) => updateField('prev_last_visit_date', e.target.value)} /></div>
                  )}
                  <div className="flex items-center gap-2">
                    <Checkbox checked={formData.prev_visa_refused} onCheckedChange={(v) => updateField('prev_visa_refused', !!v)} />
                    <Label>Já teve visto negado?</Label>
                  </div>
                  {formData.prev_visa_refused && (
                    <div className="space-y-2"><Label>Motivo da recusa</Label><Textarea value={formData.prev_refused_reason} onChange={(e) => updateField('prev_refused_reason', e.target.value)} /></div>
                  )}
                  <div className="flex items-center gap-2">
                    <Checkbox checked={formData.prev_visa_cancelled} onCheckedChange={(v) => updateField('prev_visa_cancelled', !!v)} />
                    <Label>Já teve visto cancelado?</Label>
                  </div>
                  {formData.prev_visa_cancelled && (
                    <div className="space-y-2"><Label>Motivo do cancelamento</Label><Textarea value={formData.prev_cancel_reason} onChange={(e) => updateField('prev_cancel_reason', e.target.value)} /></div>
                  )}
                  <div className="flex items-center gap-2">
                    <Checkbox checked={formData.prev_overstayed} onCheckedChange={(v) => updateField('prev_overstayed', !!v)} />
                    <Label>Já permaneceu além do prazo nos EUA?</Label>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 8 */}
            {currentStep === 8 && (
              <div className="space-y-6">
                <h2 className="font-display text-xl font-bold">Questões de segurança</h2>
                <p className="text-sm text-muted-foreground">Responda SIM ou NÃO para cada pergunta. Se SIM, forneça detalhes.</p>
                {SECURITY_QUESTIONS.map((question, i) => {
                  const n = i + 1
                  const val = formData[`sec_q${n}` as keyof FormData] as boolean | null
                  const details = formData[`sec_q${n}_details` as keyof FormData] as string
                  return (
                    <div key={n} className="space-y-2 p-4 rounded-lg bg-muted/50">
                      <p className="text-sm font-medium text-foreground">{n}. {question}</p>
                      <div className="flex gap-4">
                        <Button type="button" size="sm" variant={val === true ? 'default' : 'outline'}
                          onClick={() => updateField(`sec_q${n}` as keyof FormData, true as never)}>Sim</Button>
                        <Button type="button" size="sm" variant={val === false ? 'default' : 'outline'}
                          onClick={() => updateField(`sec_q${n}` as keyof FormData, false as never)}>Não</Button>
                      </div>
                      {val === true && (
                        <Textarea value={details} onChange={(e) => updateField(`sec_q${n}_details` as keyof FormData, e.target.value as never)}
                          placeholder="Forneça detalhes..." className="mt-2" />
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button variant="outline" onClick={() => setCurrentStep(Math.max(1, currentStep - 1))} disabled={currentStep === 1}>
                ← Anterior
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleSaveDraft} disabled={saving}>
                  {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Salvando...</> : 'Salvar rascunho'}
                </Button>
                {currentStep < FORM_STEPS.length ? (
                  <Button onClick={handleNext} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Próxima etapa →'}
                  </Button>
                ) : (
                  <Button className="bg-success hover:bg-success/90 text-success-foreground" onClick={handleNext} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enviar formulário'}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Formulario

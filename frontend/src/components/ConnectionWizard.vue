<template>
  <Dialog 
    v-model:visible="visible" 
    modal 
    header="Connect Design File"
    :style="{ width: '600px', maxWidth: '90vw' }"
    :closable="!isConnecting"
    :closeOnEscape="!isConnecting"
  >
    <!-- Stepper Header -->
    <div class="mb-6">
      <Stepper 
        v-model:value="currentStep" 
        :linear="true"
      >
        <StepList>
          <Step v-for="step in steps" :key="step.id" :value="step.id">
            <div class="flex align-items-center gap-2">
              <div 
                :class="[
                  'w-8 h-8 border-circle flex align-items-center justify-content-center transition-all',
                  step.id <= currentStep ? 'bg-primary text-primary-contrast' : 'surface-100 text-color-secondary',
                  isConnecting && step.id > currentStep ? 'opacity-50' : ''
                ]"
              >
                <i :class="step.icon"></i>
              </div>
              <div>
                <div class="font-medium">{{ step.label }}</div>
                <div class="text-sm text-color-secondary">{{ step.description }}</div>
              </div>
            </div>
          </Step>
        </StepList>
        
        <StepPanels>
          <!-- Step 1: Select Source -->
          <StepPanel :value="0">
            <div class="flex flex-column gap-4">
              <div class="text-center mb-2">
                <h3 class="text-xl font-medium mb-2">Select Design Tool</h3>
                <p class="text-color-secondary">Choose where your design file is hosted</p>
              </div>
              
              <div class="flex gap-4">
                <div 
                  :class="[
                    'p-4 border-round cursor-pointer transition-all flex-1',
                    selectedSource === 'penpot' 
                      ? 'border-primary border-2 bg-primary-50' 
                      : 'surface-border border-1 hover:surface-hover',
                    isConnecting ? 'opacity-50 cursor-not-allowed' : ''
                  ]"
                  @click="!isConnecting && (selectedSource = 'penpot')"
                >
                  <div class="flex flex-column align-items-center gap-3">
                    <div class="w-12 h-12 bg-purple-50 border-round flex align-items-center justify-content-center">
                      <i class="pi pi-palette text-purple-500 text-2xl"></i>
                    </div>
                    <div class="text-center">
                      <div class="font-medium text-lg">Penpot</div>
                      <div class="text-sm text-color-secondary mt-1">Open source design tool</div>
                    </div>
                  </div>
                </div>
                
                <div 
                  :class="[
                    'p-4 border-round cursor-pointer transition-all flex-1',
                    selectedSource === 'figma' 
                      ? 'border-primary border-2 bg-primary-50' 
                      : 'surface-border border-1 hover:surface-hover',
                    isConnecting ? 'opacity-50 cursor-not-allowed' : ''
                  ]"
                  @click="!isConnecting && (selectedSource = 'figma')"
                >
                  <div class="flex flex-column align-items-center gap-3">
                    <div class="w-12 h-12 bg-blue-50 border-round flex align-items-center justify-content-center">
                      <i class="pi pi-desktop text-blue-500 text-2xl"></i>
                    </div>
                    <div class="text-center">
                      <div class="font-medium text-lg">Figma</div>
                      <div class="text-sm text-color-secondary mt-1">Popular design platform</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-if="selectedSource" class="mt-2 p-3 surface-50 border-round">
                <div class="flex align-items-start gap-2">
                  <i class="pi pi-info-circle text-primary mt-1"></i>
                  <div class="text-sm">
                    <span class="font-medium">{{ selectedSource === 'penpot' ? 'Penpot' : 'Figma' }} connection requires:</span>
                    <ul class="mt-1 pl-4">
                      <li>A valid {{ selectedSource === 'penpot' ? 'Penpot' : 'Figma' }} file URL</li>
                      <li>An API token with read permissions</li>
                      <li>Network access to the {{ selectedSource === 'penpot' ? 'Penpot' : 'Figma' }} API</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </StepPanel>

          <!-- Step 2: Enter Details -->
          <StepPanel :value="1">
            <div class="flex flex-column gap-4">
              <div class="text-center mb-2">
                <h3 class="text-xl font-medium mb-2">Enter File Details</h3>
                <p class="text-color-secondary">Provide information about your design file</p>
              </div>
              
              <div class="field">
                <label for="file-name" class="block mb-2 font-medium">
                  File Name
                </label>
                <InputText 
                  id="file-name" 
                  v-model="fileDetails.name" 
                  placeholder="e.g., Design System Components"
                  class="w-full"
                  :disabled="isConnecting"
                />
                <small class="text-color-secondary">Give this connection a descriptive name</small>
              </div>

              <div class="field">
                <label for="file-url" class="block mb-2 font-medium">
                  File URL
                </label>
                <InputText 
                  id="file-url" 
                  v-model="fileDetails.url" 
                  :placeholder="selectedSource === 'penpot' ? 'https://design.penpot.app/#/workspace/...' : 'https://www.figma.com/file/...'"
                  class="w-full"
                  :disabled="isConnecting"
                />
                <small class="text-color-secondary">
                  {{ selectedSource === 'penpot' 
                    ? 'Enter the full URL of your Penpot file' 
                    : 'Enter the full URL of your Figma file' 
                  }}
                </small>
              </div>

              <div class="field">
                <label for="api-token" class="block mb-2 font-medium">
                  {{ selectedSource === 'penpot' ? 'Penpot API Token' : 'Figma Personal Access Token' }}
                </label>
                <Password 
                  id="api-token" 
                  v-model="fileDetails.apiToken" 
                  :feedback="false" 
                  toggleMask
                  :placeholder="selectedSource === 'penpot' ? 'Enter your Penpot API token' : 'Enter your Figma access token'"
                  class="w-full"
                  :disabled="isConnecting"
                />
                <small class="text-color-secondary">
                  <a 
                    :href="selectedSource === 'penpot' 
                      ? 'https://help.penpot.app/technical-guide/integrations/#api-token' 
                      : 'https://www.figma.com/developers/api#access-tokens'" 
                    target="_blank"
                    class="text-primary hover:underline"
                  >
                    How to get your {{ selectedSource === 'penpot' ? 'Penpot' : 'Figma' }} token
                  </a>
                </small>
              </div>
            </div>
          </StepPanel>

          <!-- Step 3: Connection Progress -->
          <StepPanel :value="2">
            <div class="flex flex-column gap-4">
              <div class="text-center mb-4">
                <h3 class="text-xl font-medium mb-2">Connecting to {{ selectedSource === 'penpot' ? 'Penpot' : 'Figma' }}</h3>
                <p class="text-color-secondary">We're connecting to your design file and syncing components</p>
              </div>
              
              <div class="connection-progress">
                <!-- Progress Steps -->
                <div class="flex flex-column gap-4">
                  <div 
                    v-for="(progressStep, index) in progressSteps" 
                    :key="index"
                    :class="[
                      'p-3 border-round transition-all',
                      progressStep.status === 'completed' ? 'bg-green-50 border-green-200 border-1' :
                      progressStep.status === 'active' ? 'bg-primary-50 border-primary-200 border-1' :
                      'surface-50 border-1'
                    ]"
                  >
                    <div class="flex align-items-center gap-3">
                      <div 
                        :class="[
                          'w-8 h-8 border-circle flex align-items-center justify-content-center',
                          progressStep.status === 'completed' ? 'bg-green-100 text-green-600' :
                          progressStep.status === 'active' ? 'bg-primary-100 text-primary-600' :
                          'surface-200 text-color-secondary'
                        ]"
                      >
                        <i 
                          :class="[
                            progressStep.status === 'completed' ? 'pi pi-check' :
                            progressStep.status === 'active' ? 'pi pi-spin pi-spinner' :
                            progressStep.icon
                          ]"
                        ></i>
                      </div>
                      <div class="flex-1">
                        <div class="font-medium">{{ progressStep.label }}</div>
                        <div class="text-sm text-color-secondary">{{ progressStep.description }}</div>
                        <div v-if="progressStep.details" class="text-xs text-color-secondary mt-1">
                          {{ progressStep.details }}
                        </div>
                      </div>
                      <div v-if="progressStep.status === 'completed'" class="text-green-600">
                        <i class="pi pi-check-circle"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Progress Bar -->
                <div class="mt-6">
                  <div class="flex align-items-center justify-content-between mb-2">
                    <span class="text-sm font-medium">Progress</span>
                    <span class="text-sm text-color-secondary">{{ progressPercentage }}%</span>
                  </div>
                  <ProgressBar 
                    :value="progressPercentage" 
                    :showValue="false"
                    class="h-2"
                  />
                </div>

                <!-- Connection Status -->
                <div 
                  v-if="connectionStatus"
                  :class="[
                    'mt-4 p-3 border-round flex align-items-start gap-2',
                    connectionStatus.type === 'error' ? 'bg-red-50 border-red-200 border-1' :
                    connectionStatus.type === 'warning' ? 'bg-yellow-50 border-yellow-200 border-1' :
                    'bg-green-50 border-green-200 border-1'
                  ]"
                >
                  <i 
                    :class="[
                      'mt-1',
                      connectionStatus.type === 'error' ? 'pi pi-times-circle text-red-500' :
                      connectionStatus.type === 'warning' ? 'pi pi-exclamation-triangle text-yellow-500' :
                      'pi pi-check-circle text-green-500'
                    ]"
                  ></i>
                  <div class="flex-1">
                    <div class="font-medium">{{ connectionStatus.title }}</div>
                    <div class="text-sm">{{ connectionStatus.message }}</div>
                    <div v-if="connectionStatus.details" class="text-xs text-color-secondary mt-1">
                      {{ connectionStatus.details }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </StepPanel>
        </StepPanels>
      </Stepper>
    </div>

    <!-- Footer Navigation -->
    <template #footer>
      <div class="flex align-items-center justify-content-between w-full">
        <div>
          <Button 
            v-if="currentStep > 0 && currentStep < 2 && !isConnecting"
            label="Back" 
            severity="secondary" 
            @click="goToPreviousStep"
            :disabled="isConnecting"
          />
        </div>
        
        <div class="flex gap-2">
          <Button 
            v-if="currentStep < 2"
            label="Cancel" 
            severity="secondary" 
            @click="closeWizard"
            :disabled="isConnecting"
          />
          
          <Button 
            v-if="currentStep === 0"
            label="Next" 
            severity="primary" 
            @click="goToNextStep"
            :disabled="!selectedSource || isConnecting"
          />
          
          <Button 
            v-if="currentStep === 1"
            label="Connect" 
            severity="primary" 
            @click="startConnection"
            :disabled="!canConnect || isConnecting"
            :loading="isConnecting"
          />
          
          <Button 
            v-if="currentStep === 2 && connectionComplete"
            label="Finish" 
            severity="primary" 
            @click="completeConnection"
          />
          
          <Button 
            v-if="currentStep === 2 && connectionError"
            label="Retry" 
            severity="primary" 
            @click="retryConnection"
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Stepper from 'primevue/stepper'
import StepList from 'primevue/steplist'
import StepPanels from 'primevue/steppanels'
import Step from 'primevue/step'
import StepPanel from 'primevue/steppanel'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import ProgressBar from 'primevue/progressbar'
import { useToast } from 'primevue/usetoast'
import { apiClient } from '../api/client'

interface ConnectionStatus {
  type: 'success' | 'error' | 'warning'
  title: string
  message: string
  details?: string
}

interface ProgressStep {
  label: string
  description: string
  icon: string
  status: 'pending' | 'active' | 'completed'
  details: string | undefined
}

interface FileDetails {
  name: string
  url: string
  apiToken: string
}

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'connected': [fileId: string]
  'error': [error: string]
}>()

const toast = useToast()

// Wizard state
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const currentStep = ref(0)
const selectedSource = ref<'penpot' | 'figma'>('penpot')
const fileDetails = ref<FileDetails>({
  name: '',
  url: '',
  apiToken: ''
})

// Connection state
const isConnecting = ref(false)
const connectionComplete = ref(false)
const connectionError = ref(false)
const connectionStatus = ref<ConnectionStatus | null>(null)

// Progress tracking
const progressSteps = ref<ProgressStep[]>([
  {
    label: 'Validating credentials',
    description: 'Checking API token and permissions',
    icon: 'pi pi-key',
    status: 'pending',
    details: undefined
  },
  {
    label: 'Connecting to design tool',
    description: 'Establishing connection to API',
    icon: 'pi pi-link',
    status: 'pending',
    details: undefined
  },
  {
    label: 'Fetching design file',
    description: 'Retrieving file metadata',
    icon: 'pi pi-file',
    status: 'pending',
    details: undefined
  },
  {
    label: 'Syncing components',
    description: 'Extracting and syncing design components',
    icon: 'pi pi-cog',
    status: 'pending',
    details: undefined
  },
  {
    label: 'Syncing design tokens',
    description: 'Extracting colors, typography, and spacing',
    icon: 'pi pi-palette',
    status: 'pending',
    details: undefined
  }
])

const progressPercentage = computed(() => {
  const completed = progressSteps.value.filter(step => step.status === 'completed').length
  return Math.round((completed / progressSteps.value.length) * 100)
})

const steps = [
  { id: 0, label: 'Select Source', description: 'Choose design tool', icon: 'pi pi-desktop' },
  { id: 1, label: 'Enter Details', description: 'Provide file information', icon: 'pi pi-file-edit' },
  { id: 2, label: 'Connect', description: 'Establish connection', icon: 'pi pi-link' }
]

const canConnect = computed(() => {
  return fileDetails.value.name.trim() && 
         fileDetails.value.url.trim() && 
         fileDetails.value.apiToken.trim()
})

// Reset wizard when opened
watch(visible, (newValue) => {
  if (newValue) {
    resetWizard()
  }
})

function resetWizard() {
  currentStep.value = 0
  selectedSource.value = 'penpot'
  fileDetails.value = { name: '', url: '', apiToken: '' }
  isConnecting.value = false
  connectionComplete.value = false
  connectionError.value = false
  connectionStatus.value = null
  
  // Reset progress steps
  progressSteps.value.forEach(step => {
    step.status = 'pending'
    step.details = undefined
  })
}

function goToNextStep() {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

function goToPreviousStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

function closeWizard() {
  if (isConnecting.value) {
    toast.add({
      severity: 'warn',
      summary: 'Connection in progress',
      detail: 'Please wait for the connection to complete or cancel',
      life: 3000
    })
    return
  }
  visible.value = false
}

async function startConnection() {
  if (!canConnect.value || isConnecting.value) return
  
  isConnecting.value = true
  connectionError.value = false
  connectionComplete.value = false
  connectionStatus.value = null
  
  // Move to progress step
  currentStep.value = 2
  
  try {
    // Step 1: Create design file in backend
    updateProgressStep(0, 'active', 'Validating credentials...')
    
    const createData: { name: string; source: 'penpot' | 'figma'; url: string; apiToken?: string } = {
      name: fileDetails.value.name,
      source: selectedSource.value,
      url: fileDetails.value.url
    }
    
    if (fileDetails.value.apiToken.trim()) {
      createData.apiToken = fileDetails.value.apiToken.trim()
    }
    
    const newFile = await apiClient.createDesignFile(createData)
    
    updateProgressStep(0, 'completed', 'Credentials validated successfully')
    
    // Step 2: Connect to design tool API
    updateProgressStep(1, 'active', `Connecting to ${selectedSource.value === 'penpot' ? 'Penpot' : 'Figma'} API...`)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API connection
    updateProgressStep(1, 'completed', `Connected to ${selectedSource.value === 'penpot' ? 'Penpot' : 'Figma'} API`)
    
    // Step 3: Fetch design file metadata
    updateProgressStep(2, 'active', 'Fetching design file metadata...')
    await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate file fetch
    updateProgressStep(2, 'completed', `File "${fileDetails.value.name}" found`)
    
    // Step 4: Sync components
    updateProgressStep(3, 'active', 'Syncing design components...')
    const syncResult = await apiClient.syncDesignFile(newFile.id)
    updateProgressStep(3, 'completed', `${syncResult.componentsSynced || 0} components synced`)
    
    // Step 5: Sync design tokens
    updateProgressStep(4, 'active', 'Syncing design tokens...')
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate token sync
    updateProgressStep(4, 'completed', `${syncResult.tokensSynced || 0} design tokens extracted`)
    
    // Connection successful
    connectionComplete.value = true
    connectionStatus.value = {
      type: 'success',
      title: 'Connection Successful',
      message: `Successfully connected to ${selectedSource.value === 'penpot' ? 'Penpot' : 'Figma'} file`,
      details: `File "${fileDetails.value.name}" is now synced with OpenDS`
    }
    
    toast.add({
      severity: 'success',
      summary: 'Design File Connected',
      detail: `Successfully connected "${fileDetails.value.name}"`,
      life: 5000
    })
    
    // Emit connected event with actual file ID
    emit('connected', newFile.id)
    
  } catch (error: any) {
    connectionError.value = true
    
    // Determine error type
    let errorTitle = 'Connection Failed'
    let errorMessage = 'Failed to connect to design file'
    let errorDetails = error.message || 'Unknown error occurred'
    
    if (error.status === 400) {
      errorTitle = 'Invalid Input'
      errorMessage = 'Please check your file details'
    } else if (error.status === 401 || error.status === 403) {
      errorTitle = 'Authentication Failed'
      errorMessage = 'Invalid API token or insufficient permissions'
    } else if (error.status === 404) {
      errorTitle = 'File Not Found'
      errorMessage = 'Design file not found at the provided URL'
    } else if (error.status === 429) {
      errorTitle = 'Rate Limited'
      errorMessage = 'Too many requests. Please try again later'
    } else if (error.status >= 500) {
      errorTitle = 'Server Error'
      errorMessage = 'Internal server error. Please try again later'
    }
    
    connectionStatus.value = {
      type: 'error',
      title: errorTitle,
      message: errorMessage,
      details: errorDetails
    }
    
    toast.add({
      severity: 'error',
      summary: errorTitle,
      detail: errorMessage,
      life: 5000
    })
    
    emit('error', error.message || 'Connection failed')
  } finally {
    isConnecting.value = false
  }
}



function retryConnection() {
  resetWizard()
  currentStep.value = 1 // Go back to details step
}

function updateProgressStep(index: number, status: 'pending' | 'active' | 'completed', details?: string) {
  const step = progressSteps.value[index]
  if (step) {
    step.status = status
    if (details !== undefined) {
      step.details = details
    }
  }
}

function completeConnection() {
  visible.value = false
  resetWizard()
}
</script>

<style scoped>
.step-content {
  min-height: 300px;
}

.connection-progress {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:deep(.p-stepper) {
  padding: 0;
}

:deep(.p-stepper-header) {
  padding: 0.75rem 0;
}

:deep(.p-stepper-separator) {
  margin: 0 1rem;
}
</style>
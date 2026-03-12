from nova_act import NovaAct, GuardrailDecision, GuardrailInputState
from urllib.parse import urlparse
import fnmatch

def autopass_guardrail(state: GuardrailInputState) -> GuardrailDecision:
    return GuardrailDecision.PASS
package org.morphql.jetbrains

import com.intellij.lang.injection.MultiHostInjector
import com.intellij.lang.injection.MultiHostRegistrar
import com.intellij.openapi.util.TextRange
import com.intellij.psi.PsiElement
import com.intellij.psi.PsiLanguageInjectionHost
import com.intellij.psi.util.PsiTreeUtil

class MorphQLInjector : MultiHostInjector {
    override fun getLanguagesToInject(registrar: MultiHostRegistrar, host: PsiElement) {
        if (host is PsiLanguageInjectionHost && isMorphQLTemplate(host)) {
            // We inject the language into the whole content of the template string
            // Excluding the surrounding backticks
            val length = host.textLength
            if (length >= 2) {
              registrar.startInjecting(MorphQLLanguage)
                .addPlace(null, null, host, TextRange(1, length - 1))
                .doneInjecting()
            }
        }
    }

    override fun elementsToInjectIn(): List<Class<out PsiElement>> {
        // We try to find template string elements. 
        // Since we don't want to depend strictly on the JavaScript plugin's classes here 
        // to avoid compile-time issues if the user doesn't have it, we use a more generic approach
        // or we use the common PsiLanguageInjectionHost.
        return listOf(PsiLanguageInjectionHost::class.java)
    }

    private fun isMorphQLTemplate(host: PsiElement): Boolean {
        // Tagged template strings in JS/TS usually look like: TagName`content`
        // We check if the previous sibling (or parent's sibling depending on PSI structure) is the 'morphQL' identifier
        
        // A common structure for tagged templates in IntelliJ's JS PSI:
        // JSTaggedTemplateExpression
        //   JSReferenceExpression (the tag)
        //   JSLiteralExpression (the template string)
        
        val parent = host.parent ?: return false
        if (parent.javaClass.simpleName.contains("TaggedTemplate", ignoreCase = true)) {
            val firstChild = parent.firstChild
            if (firstChild != null && (firstChild.text == "morphQL" || firstChild.text == "mql")) {
                return true
            }
        }
        
        return false
    }
}
